import { Metric } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then((webVitals) => {
      webVitals.default.getCLS(onPerfEntry);
      webVitals.default.getFCP(onPerfEntry);
      webVitals.default.getFID(onPerfEntry);
      webVitals.default.getLCP(onPerfEntry);
      webVitals.default.getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
