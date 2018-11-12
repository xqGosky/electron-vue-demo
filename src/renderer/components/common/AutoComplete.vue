<template lang="html">
  <el-autocomplete
    class="inline-input fullWidth"
    v-model="phone"
    :fetch-suggestions="querySearchAsync"
    placeholder="请输入手机号码"
    @select="handleSelect"
  ></el-autocomplete>
</template>

<script>
export default {
  data () {
    return {
      phoneArr: [],
      phone: '',
      selectId: null
    }
  },
  watch: {
    phone: {
      handler: function (val, oldVal) {
        this.fetchPhone(val)
      }
    }
  },
  mounted () {
    this.fetchPhone()
  },
  computed: {},
  ready () {},
  attached () {},
  methods: {
    handleSelect (item) {
      this.selectId = item.userId
    },
    fetchPhone (val) {
      common.ajax({
        url: '/Admin/home/user',
        params: {keyword: val},
        success: (result) => {
          let userInfoList = result.object.userInfoList
          for (var i = 0; i < userInfoList.length; i++) {
            userInfoList[i].value = userInfoList[i].mobile + '---' + userInfoList[i].name
          }
          console.log(userInfoList)
          this.phoneArr = userInfoList
        }
      })
    },
    querySearchAsync (queryString, cb) {
      var phoneArr = this.phoneArr
      var results = queryString ? phoneArr.filter(this.createStateFilter(queryString)) : phoneArr
      cb(results)
    },
    createStateFilter (queryString) {
      return (state) => {
        return (state.value.indexOf(queryString.toLowerCase()) === 0)
      }
    }
  },
  components: {}
}
</script>

<style lang="css">
</style>
