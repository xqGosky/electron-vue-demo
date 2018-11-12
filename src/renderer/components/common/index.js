import PaginateComponent from './Paginate.vue'
import UploadImgComponent from './UploadImg.vue'
import UploadVideoComponent from './UploadVideo.vue'
import RichTextComponent from './RichText.vue'
import UploadMutiImgComponent from './UploadMutiImg.vue'
import AutoCompleteComponent from './AutoComplete.vue'

export const Paginate = {
  install: function (Vue) {
    Vue.component('Paginate', PaginateComponent)
  }
}
export const UploadImg = {
  install: function (Vue) {
    Vue.component('UploadImg', UploadImgComponent)
  }
}
export const UploadVideo = {
  install: function (Vue) {
    Vue.component('UploadVideo', UploadVideoComponent)
  }
}
export const RichText = {
  install: function (Vue) {
    Vue.component('RichText', RichTextComponent)
  }
}
export const UploadMutiImg = {
  install: function (Vue) {
    Vue.component('UploadMutiImg', UploadMutiImgComponent)
  }
}
export const AutoComplete = {
  install: function (Vue) {
    Vue.component('AutoComplete', AutoCompleteComponent)
  }
}
