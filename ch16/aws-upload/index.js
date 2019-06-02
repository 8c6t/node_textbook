const AWS = require('aws-sdk');
// 이미지 조작 패키지. imageMagick 방식으로 이미지 리사이징
const gm = require('gm').subClass({ imageMagick: true });
const s3 = new AWS.S3();


/**
  handler 함수가 Lambda 호출 시 실행되는 함수

  @param  event     호출 상황에 대한 정보
  @param  context   실행되는 함수 환경에 대한 정보
  @param  callback  함수가 완료되었는지를 람다에게 알려줌
*/
exports.handler = (event, context, callback) => {
  // event 객체로부터 버킷 이름과 파일 경로를 받아옴
  const Bucket = event.Records[0].s3.bucket.name;
  const Key = event.Records[0].s3.object.key;
  const filename = Key.split('/')[Key.split('/').length - 1];
  const ext = Key.split('.')[Key.split('.').length - 1];

  // s3.getObject 메소드로 버킷으로부터 파일을 불러옴. data.Body에 버퍼가 담겨있음
  s3.getObject({ Bucket, Key }, (err, data) => {
    if (err) {
      console.error(err);
      return callback(err);
    }
    // gm 함수에 파일 버퍼를 넣고, resize 메소드로 크기를 지정
    return gm(data.Body)
      .resize(200, 200, '^')
      .quality(90)
      .toBuffer(ext, (err, buffer) => {
        if (err) {
          console.error(err);
          return callback(err);
        }
        // s3.putObject 메소드로 리사이징된 이미지를 thumb 폴더 아래에 저장
        return s3.putObject({
          Bucket,
          Key: `thumb/${filename}`,
          Body: buffer,
        }, (err) => {
          if (err) {
            console.error(err);
            return callback(err);
          }
          return callback(null, `thumb/${filename}`);
        });
      });
  });
};