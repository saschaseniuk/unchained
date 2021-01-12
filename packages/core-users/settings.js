const everySecondDay = 'every 2 days';
const emptyObject = () => {
  return {};
};

const settings = {
  autoSchedulingCronText: null,
  autoSchedulingInput: null,
  load({
    autoSchedulingCronText = everySecondDay,
    autoSchedulingInput = emptyObject,
  } = {}) {
    this.autoSchedulingCronText = autoSchedulingCronText;
    this.autoSchedulingInput = autoSchedulingInput || emptyObject;
  },
};

export default settings;
