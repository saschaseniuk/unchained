import { Meteor } from 'meteor/meteor';
import fs from 'fs'; // Required to read files initially uploaded via Meteor-Files
import { MongoInternals } from 'meteor/mongo';
import os from 'os';
import { sep } from 'path';

const tmpDir = os.tmpdir();

const FILE_STORAGE_TEMP_FOLDER = fs.mkdtempSync(`${tmpDir}${sep}`);

const getContentDisposition = (fileName, downloadFlag) => {
  const dispositionType = downloadFlag === 'true' ? 'attachment;' : 'inline;';

  const encodedName = encodeURIComponent(fileName);
  const dispositionName = `filename="${encodedName}"; filename=*UTF-8"${encodedName}";`;
  const dispositionEncoding = 'charset=utf-8';

  return `${dispositionType} ${dispositionName} ${dispositionEncoding}`;
};

export default (collectionName) => {
  const gridFSBucket = new MongoInternals.NpmModule.GridFSBucket(
    MongoInternals.defaultRemoteCollectionDriver().mongo.db,
    { bucketName: collectionName }
  );
  const ObjID = MongoInternals.NpmModule.ObjectID;

  return {
    storagePath() {
      return `${FILE_STORAGE_TEMP_FOLDER}${sep}${this.collectionName}`;
    },
    onAfterUpload(file) {
      // Move file to GridFS
      Object.keys(file.versions).forEach((versionName) => {
        const metadata = { ...file.meta, versionName, fileId: file._id };
        fs.createReadStream(file.versions[versionName].path)
          .pipe(
            gridFSBucket.openUploadStream(file.name, {
              contentType: file.type || 'binary/octet-stream',
              metadata,
            })
          )
          .on('error', (err) => {
            console.error(err); // eslint-disable-line
            this.unlink(this.collection.findOne(file._id), versionName);
            throw err;
          })
          .on(
            'finish',
            Meteor.bindEnvironment((ver) => {
              const property = `versions.${versionName}.meta.gridFsFileId`;
              this.collection.update(
                { _id: file._id },
                {
                  $set: { [property]: ver._id.toHexString() },
                }
              );
              this.unlink(
                this.collection.findOne({ _id: file._id }),
                versionName
              ); // Unlink files from FS
            })
          );
      });
    },
    interceptDownload(http, file, versionName) {
      const { gridFsFileId } = file.versions[versionName].meta || {};
      if (gridFsFileId) {
        const readStream = gridFSBucket.openDownloadStream(
          new ObjID(gridFsFileId)
        );
        readStream.on('data', (data) => {
          http.response.write(data);
        });

        readStream.on('end', () => {
          http.response.end('end');
        });
        readStream.on('error', () => {
          // not found probably
          // eslint-disable-next-line no-param-reassign
          http.response.statusCode = 404;
          http.response.end('not found');
        });

        http.response.setHeader(
          'Content-Disposition',
          getContentDisposition(file.name, http?.params?.query?.download)
        );
        http.response.setHeader('Cache-Control', this.cacheControl);
      }
      return Boolean(gridFsFileId); // Serve file from either GridFS or FS if it wasn't uploaded yet
    },
    onAfterRemove(files) {
      files.forEach((file) => {
        Object.keys(file.versions).forEach((versionName) => {
          const { gridFsFileId } = file.versions[versionName].meta || {};
          if (gridFsFileId) {
            gridFSBucket.delete(new ObjID(gridFsFileId), (err) => {
              if (err) throw err;
            });
          }
        });
      });
    },
  };
};
