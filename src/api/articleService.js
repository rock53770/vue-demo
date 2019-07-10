import api from './request'

export default {
  getList(data) { // 获取咨询列表
    return api({
      method: 'get',
      url: '/article/get/list',
      data: data,
    })
  },
  getDetail(data) { // 获取文章内容
    return api({
      method: 'get',
      url: '/article/get/content',
      data: data,
    })
  },
  getPreviewDetail(data) { // 获取文章内容(预览、只读)
    return api({
      method: 'get',
      url: '/article/get/look/content',
      data: data,
    })
  },
  doLike(data) { // 点赞
    return api({
      method: 'post',
      url: '/article/like',
      data: data,
    })
  },
  cancelLike(data) { // 取消点赞
    return api({
      method: 'post',
      url: '/article/cancel/like',
      data: data,
    })
  },
}
