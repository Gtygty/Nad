<template>
  <div class="upload-img">
    <img :src="imageSrc" v-if="imageSrc" class="img">
    <div class="upload-btn" v-if="!imageSrc">
      <i class="el-icon-plus add-icon"></i>
    </div>
    <input type="file" id="up-file" class="up-file" @change="onUpload">
  </div>
</template>

<script>
import { CODE_OK, IsAlert } from "@/utils/api";
import { getToken } from "@/utils";

export default {
  props: {
    imageSrc: {
      type: String,
      default: ""
    }
  },
  methods: {
    onUpload(e) {
      let url = "/api/admin/img_upload";
      let fileContent = e.target.files[0];
      if (!fileContent) {
        return;
      }
      const isJPG =
        fileContent.type === "image/jpeg" || fileContent.type === "image/png";
      const isLt2M = fileContent.size / 1024 / 1024 < 2;
      if (!isJPG) {
        IsAlert("error", "图片格式只能为JPEG 或者 PNG");
        return;
      }
      if (!isLt2M) {
        IsAlert("error", "图片大小不能大于2M");
        return;
      }
      let formData = new FormData();
      formData.append("image_src", fileContent);
      this.$http
        .post(url, formData, {
          headers: {
            Authorization: localStorage.getItem("token")
              ? localStorage.getItem("token")
              : "f356aebba6cec92c53f5bf7f38de7ef5"
          }
        })
        .then(res => {
          this.$emit("emitSuccess", res);
        })
        .catch(error => {
          this.$emit("emitError", res);
        });
    }
  }
};
</script>

<style lang="less" scoped>
.upload-img {
  width: 100px;
  height: 100px;
  position: relative;
}
.up-file {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  opacity: 0;
  cursor: pointer;
}
.upload-btn {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.add-icon {
  font-size: 30px;
  color: #8c939d;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>

