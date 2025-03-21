const hashWorker = () => {
  /* eslint-disable-next-line no-restricted-globals */
  self.importScripts("http://localhost:3000/spark-md5.min.js");
  /* eslint-disable-next-line no-restricted-globals */
  self.onmessage = (e) => {
    const { chunkList } = e.data;
    /* eslint-disable-next-line no-restricted-globals */
    const spark = new self.SparkMD5.ArrayBuffer();
    let percentage = 0;
    let count = 0;
    const loadNext = (index) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(chunkList[index].chunk);
      reader.onload = (event) => {
        count++;
        spark.append(event.target.result);
        if (count === chunkList.length) {
          /* eslint-disable-next-line no-restricted-globals */
          self.postMessage({
            percentage: 100,
            hash: spark.end(),
          });
          /* eslint-disable-next-line no-restricted-globals */
          self.close();
        } else {
          percentage += 100 / chunkList.length;
          /* eslint-disable-next-line no-restricted-globals */
          self.postMessage({
            percentage,
          });
          loadNext(count);
        }
      };
    };
    loadNext(count);
  };
};

export default hashWorker;
