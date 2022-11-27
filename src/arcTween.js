import { arcPath } from './utils.js';

const arcTweenEnter = d => {
  const i = d3.interpolate(d.endAngle, d.startAngle);

  return t => {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

const arcTweenExit = d => {
  const i = d3.interpolate(d.startAngle, d.endAngle);

  return t => {
    d.startAngle = i(t);
    return arcPath(d);
  };
};

const arcTweenUpdate = function (d) {
  const i = d3.interpolate(this._current, d);

  this._current = d;

  return t => arcPath(i(t));
};

export { arcTweenEnter, arcTweenExit, arcTweenUpdate };
