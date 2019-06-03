<template>
  <div class="upLoadBtn">
    <Button :loading="fileChangeLoading" :type="color" @click="handleUpload" :size="size">{{text}}</Button>
    <input :id="idName" type="file" :accept="accept" :multiple="multiple" @change="handkeFileChange">
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'upLoadBtn',
  props: {
    idName: {
      type: String,
      required: true,
      default() {
        return 'inputid'
      }
    },
    fileChangeLoading: {
      type: Boolean,
      default() {
        return false
      }
    },
    size: {
      type: String,
      default() {
        return ''
      }
    },
    accept: {
      type: String,
      default() {
        return '.jpg,.jpeg,.png,.pdf,.doc,.docx'
      }
    },
    text: {
      type: String,
      default() {
        return 'Upload'
      }
    },
    multiple: {
      type: Boolean,
      default() {
        return false
      }
    },
    color: {
      type: String,
      default() {
        return 'primary'
      }
    },
    row: {
      type: Object,
      default() {
        return null
      }
    }
  },
  methods: {
    handleUpload() {
      document.getElementById(this.idName).click()
    },
    handkeFileChange(e) {
      const files = e.target.files
      const itemFile = this.multiple ? files : files[0] // only use files[0]
      if (this.row) {
        this.$emit('fileUpload', itemFile, this.row)
      } else {
        this.$emit('fileUpload', itemFile)
      }
    }
  }
}
</script>

<style lang="less">
.upLoadBtn {
  display: inline-block;
  input {
    display: none;
    z-index: -9999;
  }
}
</style>
