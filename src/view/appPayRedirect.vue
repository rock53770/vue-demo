
<template>
  <div>
    <div class="ta-c pt40">正在跳转，请稍后</div>
  </div>
</template>

<script>
export default {
  name: "appPayRedirect",
  data() {
    return {
      show:false,
      isInApp:GConfig.isInApp
    };
  },
  created() {
    let params = change(location.search)
    function change(str) {
      if(str == undefined) return
        str = str.substr(1)
        var arr = str.split("&"),
            obj = {},
            newArr = []
        arr.map(function(value,index,arr){
          newArr = value.split("=")
          if(newArr[0] != undefined && newArr[0] != '') {
          obj[newArr[0]] = decodeURIComponent(newArr[1])
        }
      })
      return obj
    }
    console.log(Object.assign(params,{type:'redirect'}))
    console.log(Util.getQuery("path"))
    btPage.open({
      url: decodeURIComponent(Util.getQuery("path")),
      container_style:1,
      type:1,
      params:Object.assign(params,{type:'redirect'})
    })
  },
  mounted(){
    // setPageTitle('');
  },
  methods: {
  },
};
</script>
