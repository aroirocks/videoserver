const spawn = require("child_process").spawn;

const onlyvideo = (filename, uuid) => {
  const file_path = `${__dirname}/folder_name_where_file_saveds/${filename}`;
  return new Promise((resolve, reject) => {
    var no_audio = [
      "-i",
      `${file_path}`,
      "-c",
      "copy",
      "-an",
      `${__dirname}/folder_name_where_file_saveds/noaudio_${filename}`,
    ];
    var removeaudio = spawn("ffmpeg", no_audio);
    removeaudio.on("close", function (data) {
      resolve(`noaudio_${filename}`);
    });
    removeaudio.on("error", function (error) {
      console.log(error);
      reject(error);
    });
  });
};

const onlyaudio = (filename) => {
  const file_path = `${__dirname}/folder_name_where_file_saveds/${filename}`;
  return new Promise((resolve, reject) => {
    var audioonly = [
      "-i",
      `${file_path}`,
      "-vn",
      `${__dirname}/folder_name_where_file_saveds/audio_only_${filename}.aac`,
    ];
    var onlyaudio = spawn("ffmpeg", audioonly);

    onlyaudio.on("close", function (data) {
      resolve(`audio_only_${filename}`);
    });
    onlyaudio.on("error", function (error) {
      reject(error);
    });
  });
};

const only720 = (filename) => {
  const file_path = `${__dirname}/folder_name_where_file_saveds/noaudio_${filename}`;
  return new Promise((resolve, reject) => {
    var output_720 = [
      "-i",
      `${file_path}`,
      "-vcodec",
      "libx264",
      "-crf",
      "27",
      "-preset",
      "veryfast",
      "-c:a",
      "copy",
      "-s",
      "1280x720",
      `${__dirname}/folder_name_where_file_saveds/only720_${filename}`,
    ];
    var only720 = spawn("ffmpeg", output_720);

    only720.on("close", function (data) {
      resolve(`only720_${filename}`);
    });
    only720.on("error", function (error) {
      reject(error);
    });
  });
};

const only540 = (filename) => {
  const file_path = `${__dirname}/folder_name_where_file_saveds/noaudio_${filename}`;
  return new Promise((resolve, reject) => {
    var output_540 = [
      "-i",
      `${file_path}`,
      "-vcodec",
      "libx264",
      "-crf",
      "27",
      "-preset",
      "veryfast",
      "-c:a",
      "copy",
      "-s",
      "960x540",
      `${__dirname}/folder_name_where_file_saveds/only540_${filename}`,
    ];
    var only540 = spawn("ffmpeg", output_540);

    only540.on("close", function (data) {
      resolve(`only540_${filename}`);
    });
    only540.on("error", function (error) {
      reject(error);
    });
  });
};

const only240 = (filename) => {
  const file_path = `${__dirname}/folder_name_where_file_saveds/noaudio_${filename}`;
  return new Promise((resolve, reject) => {
    var output_240 = [
      "-i",
      `${file_path}`,
      "-vcodec",
      "libx264",
      "-crf",
      "27",
      "-preset",
      "veryfast",
      "-c:a",
      "copy",
      "-s",
      "320x240",
      `${__dirname}/folder_name_where_file_saveds/only240_${filename}`,
    ];
    var only240 = spawn("ffmpeg", output_240);

    only240.on("close", function (data) {
      resolve(`only240_${filename}`);
    });
    only240.on("error", function (error) {
      reject(error);
    });
  });
};

const mpdfile = (filename) => {
  const file_path = `${__dirname}/folder_name_where_file_saveds/noaudio_${filename}`;

  return new Promise((resolve, reject) => {
    var args = [
      "-dash",
      "4000",
      "-out",
      `${__dirname}/folder_name_where_file_saveds/${filename}.mpd`,
      "-profile",
      "dashavc264:onDemand",
      `${__dirname}/folder_name_where_file_saveds/audio_only_${filename}.aac`,
      `${__dirname}/folder_name_where_file_saveds/only240_${filename}`,
      `${__dirname}/folder_name_where_file_saveds/only540_${filename}`,
      `${__dirname}/folder_name_where_file_saveds/only720_${filename}`,
    ];

    var generatempd = spawn("MP4Box", args);

    generatempd.on("close", function (data) {
      resolve(`${filename}.mpd`);
    });
    generatempd.on("error", function (error) {
      reject(error);
    });
  });
};

exports.onlyvideo = onlyvideo;
exports.onlyaudio = onlyaudio;
exports.only720 = only720;
exports.only540 = only540;
exports.only240 = only240;
exports.mpdfile = mpdfile;
