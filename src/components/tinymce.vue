<template>
  <div>
    <textarea :id="Id" :value="value"></textarea>
  </div>
</template>
<script>
// import '@/asset/js/zh_CN.js';
// import {b64hamcsha1, HexMD5, MD5 } from '@/api/hash.js';
// import {save_img_key} from "@/config/env.js";
import { AjaxApi, IsMessage } from "@/utils/api";
import iView from "iview";
export default {
  data() {
    const Id = Date.now();
    // const Id = "tinymce";
    return {
      Id: Id,
      tabName: "1",
      page: 1,
      count: null,
      netImgUrl: "",
      columns: [
        {
          title: this.$t("Name"),
          align: "center",
          minWidth: 100,
          // fixed: "left",
          render: (h, params) => {
            return h("div", [
              h(
                "img",
                {
                  attrs: {
                    title: params.row.file_name,
                    src: params.row.file_path
                  },
                  style: {
                    marginTop: "2px",
                    width: "60px"
                  }
                },
                this.$t("goods.Delete")
              )
            ]);
          }
        },
        {
          title: this.$t("Name"),
          align: "center",
          key: "file_name",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "URL",
          align: "center",
          key: "file_path",
          minWidth: 200,
          tooltip: true,
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                props: { placement: "right" }
              },
              [
                h(
                  "div",
                  {
                    style: {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "200px"
                    }
                  },
                  params.row.file_path
                ),
                h(
                  "div",
                  {
                    slot: "content",
                    style: { whiteSpace: "normal", wordBreak: "break-all" }
                  },
                  params.row.file_path
                )
              ]
            );
          }
        },
        {
          title: this.$t("Date"),
          align: "center",
          key: "created_at",
          minWidth: 100,
          tooltip: true
        },
        {
          title: this.$t("Operating"),
          minWidth: 120,
          align: "center",
          // fixed: 'right',
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  attrs: {
                    title: this.$t("Insert")
                  },
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginLeft: "5px"
                  },
                  on: {
                    click: () => {
                      window.tinymce.EditorManager.get(
                        this.Id + ""
                      ).insertContent(
                        `<img src="${params.row.file_path}" alt="" />`
                      );
                      iView.Modal.remove();
                    }
                  }
                },
                this.$t("Insert")
              ),
              h(
                "Button",
                {
                  attrs: {
                    title: this.$t("goods.Delete")
                  },
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginLeft: "5px"
                  },
                  on: {
                    click: () => {
                      this.deleteImg(params.row.id);
                    }
                  }
                },
                this.$t("goods.Delete")
              )
            ]);
          }
        }
      ],
      data: [],
      Editor: null,
      flag: true, //防止input时频繁触发watch导致光标问题
      maxSize: 2097152,
      accept: "image/jpeg, image/png, image/gif",
      DefaultConfig: {
        // GLOBAL
        height: this.editorHeight,
        theme: "silver",
        menubar: true,
        toolbar: ` undo redo  forecolor backcolor img alignleft aligncenter alignright alignjustify outdent indent numlist bullist fullscreen`,
        // toolbar: ` fontselect  fontsizeselect forecolor backcolor image alignleft aligncenter alignright alignjustify outdent indent numlist bullist undo redo fullscreen `,
        // toolbar: `styleselect | fontselect | formatselect | fontsizeselect | forecolor backcolor | bold italic underline strikethrough | image | table | alignleft aligncenter alignright alignjustify | outdent indent  code | numlist bullist | undo redo `,
        plugins: `
            searchreplace
            charmap
            paste
            importcss
            image
            code
            table
            advlist
            fullscreen
            link
            media
            lists
            textcolor
            colorpicker
            hr
            preview
          `,
        // CONFIG
        forced_root_block: "p",
        force_p_newlines: true,
        importcss_append: true,

        // CONFIG: ContentStyle 这块很重要， 在最后呈现的页面也要写入这个基本样式保证前后一致， `table`和`img`的问题基本就靠这个来填坑了
        content_style: `
            *                         { padding:0; margin:0; }
            html, body                { height:100%; }
            img                       { max-width:100%; display:block;height:auto; }
            div                       { width:100%; }
            a                         { text-decoration: none; }
            iframe                    { width: 100%; }
            p                         { line-height:1.2;}
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
            ul,ol                     { list-style-position:inside; }
          `,

        insert_button_items: "image link | inserttable",

        // CONFIG: Paste
        paste_retain_style_properties: "all",
        paste_word_valid_elements: "*[*]", // word需要它
        paste_data_images: false, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: false, // 插入word文档需要该属性
        paste_webkit_styles: "all",
        paste_merge_formats: true,
        nonbreaking_force_tab: false,
        paste_auto_cleanup_on_paste: false,

        // CONFIG: Font
        fontsize_formats: "14px 16px 18px 20px 24px",

        // CONFIG: StyleSelect
        // style_formats: [
        //   {
        //     title: '首行缩进',
        //     block:'p',
        //     styles: { 'text-indent': '2em'}
        //   },
        //   {
        //     title: '行高',
        //     items: [
        //       {title: '1', styles: { 'line-height': '1' }, inline: 'span'},
        //       {title: '1.2', styles: { 'line-height': '1.2' }, inline: 'span'},
        //       {title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span'},
        //       {title: '2', styles: { 'line-height': '2' }, inline: 'span'},
        //       {title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span'},
        //       {title: '3', styles: { 'line-height': '3' }, inline: 'span'}
        //     ]
        //   }
        // ],

        // FontSelect
        font_formats: `
            微软雅黑=微软雅黑;
            宋体=宋体;
            黑体=黑体;
            仿宋=仿宋;
            楷体=楷体;
            隶书=隶书;
            幼圆=幼圆;
            Andale Mono=andale mono,times;
            Arial=arial, helvetica,
            sans-serif;
            Arial Black=arial black, avant garde;
            Book Antiqua=book antiqua,palatino;
            Comic Sans MS=comic sans ms,sans-serif;
            Courier New=courier new,courier;
            Georgia=georgia,palatino;
            Helvetica=helvetica;
            Impact=impact,chicago;
            Symbol=symbol;
            Tahoma=tahoma,arial,helvetica,sans-serif;
            Terminal=terminal,monaco;
            Times New Roman=times new roman,times;
            Trebuchet MS=trebuchet ms,geneva;
            Verdana=verdana,geneva;
            Webdings=webdings;
            Wingdings=wingdings,zapf dingbats`,

        // Tab
        tabfocus_elements: ":prev,:next",
        object_resizing: true,

        // Image
        imagetools_toolbar:
          "rotateleft rotateright | flipv fliph | editimage imageoptions"
      }
    };
  },
  props: {
    value: {
      default: "",
      type: String
    },
    url: {
      default: "",
      type: String
    },
    withCredentials: {
      default: false,
      type: Boolean
    },

    editorHeight: {
      default: 400,
      type: Number
    }
  },

  mounted() {
    window.tinymce.baseURL = "/static/tinymce";
    this.init();
  },
  watch: {
    value(val) {
      if (this.flag) {
        window.tinymce.EditorManager.get(this.Id + "").setContent(val);
      }
      this.flag = true;
    }
  },
  beforeDestroy() {
    // 销毁tinymce
    // this.$emit('on-destroy');
    window.tinymce.remove("#" + this.Id);
  },
  methods: {
    init() {
      const self = this;
      this.Editor = window.tinymce.init({
        // 默认配置
        ...this.DefaultConfig,

        // 图片上传
        images_upload_handler: function(blobInfo, success, failure) {
          if (blobInfo.blob().size > self.maxSize) {
            failure(self.$t("SizeImg"));
          }
          if (self.accept.indexOf(blobInfo.blob().type) >= 0) {
            uploadPic();
          } else {
            failure(self.$t("formatImg"));
          }
          function uploadPic() {
            const formData = new FormData();
            formData.append("file_path", blobInfo.blob());
            formData.append("file_name", blobInfo.blob().name);
            let _params = formData;
            let successFuc = res => {
               success(res.data);
            };
            let elseFuc = res => {
              failure("Error: " + res.code);
            };
            AjaxApi("UpdateImgTINY", _params, successFuc, elseFuc);
          }
        },

        // prop内传入的的config
        ...this.config,

        // 挂载的DOM对象
        selector: `#${this.Id}`,
        setup: editor => {
          editor.ui.registry.addButton("img", {
            icon: "image",
            // text: "IMG",
            tooltip: "Insert Image/Image List",
            onAction: function(_) {
              iView.Modal.confirm({
                width: 800,
                okText: self.$t('Apply'),
                cancelText: self.$t('Cancel'),
                onOk: () => {
                  let n = self.tabName * 1;
                  switch (n) {
                    case 1:
                      break;
                    case 2:
                      break;
                    case 3:
                      if (!self.netImgUrl) {
                        return;
                      }
                      editor.insertContent(
                        `<img src="${self.netImgUrl}" alt="" />`
                      );
                      break;
                    default:
                      iView.Modal.remove();
                  }
                },
                onCancel	: () => {
                  self.data=[];
                  // iView.Modal.remove(); //iview remove node报错
                },
                render: h => {
                  return h(
                    "Tabs",
                    {
                      props: {
                        value: "1"
                      },
                      class: {
                        tinyIMG: true
                      },
                      on: {
                        "on-click": name => {
                          self.tabName = name;
                          if (name === "2") {
                            self.getList(10, 1);
                          }
                        }
                      }
                    },
                    [
                      h(
                        "TabPane",
                        {
                          props: {
                            label: self.$t("uploadImage"),
                            name: "1"
                          }
                        },
                        [
                          h("input", {
                            domProps: {
                              type: "file",
                              id: "file-picker"
                            },
                            style: {
                              display: "none"
                            },
                            on: {
                              change: e => {
                                let formData = new FormData();
                                formData.append(
                                  "file_name",
                                  e.target.files[0].name
                                );
                                formData.append("file_path", e.target.files[0]);
                                const isJPG =
                                  e.target.files[0].type === "image/jpeg" ||
                                  e.target.files[0].type === "image/png";
                                const isLt2M =
                                  e.target.files[0].size / 1024 / 1024 < 2;
                                if (!isJPG) {
                                  IsMessage("error", self.$t("formatImg"));
                                  return;
                                }
                                if (!isLt2M) {
                                  IsMessage("error", self.$t("SizeImg"));
                                  return;
                                }
                                let successFuc = res => {
                                  let img = `<img src="${res.data}" alt="" />`;
                                  editor.insertContent(img);
                                  iView.Modal.remove();
                                };
                                let elseFuc = res => {
                                  iView.Modal.remove();
                                };
                                AjaxApi(
                                  "UpdateImgTINY",
                                  formData,
                                  successFuc,
                                  elseFuc
                                );
                              }
                            }
                          }),
                          h(
                            "Button",
                            {
                              props: {
                                type: "primary"
                              },
                              on: {
                                click: () => {
                                  document
                                    .querySelector("#file-picker")
                                    .click();
                                }
                              }
                            },
                            self.$t("Browse")
                          )
                        ]
                      ),
                      h(
                        "TabPane",
                        {
                          props: {
                            label: self.$t("UploadedImage"),
                            name: "2"
                          }
                        },
                        [
                          h(
                            "div",
                            {
                              style: {
                                display: self.tabName !== "2" ? "none" : "block"
                              }
                            },
                            [
                              h("Table", {
                                props: {
                                  border: true,
                                  columns: self.columns,
                                  data: self.data
                                }
                              }),
                              h(
                                "div",
                                {
                                  attrs: {
                                    class: "com-footer-right"
                                  }
                                },
                                [
                                  h("Page", {
                                    props: {
                                      total: self.count,
                                      simple: true,
                                      current: self.page
                                    },
                                    on: {
                                      "on-change": page => {
                                        self.page = page;
                                        self.getList(10, page);
                                      }
                                      // "on-page-size-change":()=>{},
                                    }
                                  })
                                ]
                              )
                            ]
                          )
                        ]
                      ),
                      h(
                        "TabPane",
                        {
                          props: {
                            label: self.$t("WebImage"),
                            name: "3"
                          }
                        },
                        [
                          h("Input", {
                            props: {
                              value: this.value,
                              autofocus: true,
                              placeholder: "Please enter the image src..."
                            },
                            on: {
                              input: val => {
                                self.netImgUrl = val;
                              }
                            }
                          })
                        ]
                      )
                    ]
                  );
                }
              });
            }
          });
          // 抛出 'on-ready' 事件钩子
          editor.on("init", () => {
            self.loading = false;
            //self.$emit('on-ready');
            editor.setContent(self.value);
          });
          // 抛出 'input' 事件钩子，同步value数据
          editor.on("input change undo redo", () => {
            // 只在用户输入导致事件相应时才更新value数据
            self.flag = false;
            self.$emit("input", editor.getContent());
          });
          editor.on("init", function() {
            editor.getDoc().body.style.fontSize = "16px";
            editor.getDoc().body.style.fontFamily = "微软雅黑";
          });
        }
      });
    },
    getList(limit, page) {
      let _params = {
        limit: limit,
        page: page
      };
      let successFuc = res => {
        this.data = res.data.data;
        this.count = res.count;
      };
      let elseFuc = res => {};
      AjaxApi("GetImgTINY", _params, successFuc, elseFuc);
    },
    deleteImg(id) {
      let _params = {
        id: id,
        params: {
          _method: "DELETE"
        }
      };
      let successFuc = res => {
        this.getList(10, this.page);
      };
      let elseFuc = res => {};
      AjaxApi("DeleteImgTINY", _params, successFuc, elseFuc);
    }
  }
};
</script>
<style lang="less">
.tinyIMG {
  .ivu-modal-confirm-footer {
    display: none !important;
  }
  .ivu-table-cell {
    padding: 0 5px !important;
  }
}
</style>
