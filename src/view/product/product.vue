
<template>
    <div class="flex pos-a b0 l0 r0 t0" style="flex-direction: column;">
      <lifeProductList class="flex-1 "></lifeProductList>
      <footerBar path="product" class="w-100"></footerBar>
    </div>
</template>

<script>
import footerBar from "@/components/Footer";
import lifeProductList from "@/view/life/lifeProductList";
export default {
    name: "product",
    data() {
        return {
          // navHeight: Util.getNavHeight(),
          // navHeight: 44,
        };
    },
    created() {
    },
    methods: {
    },
    mounted() {
        setPageTitle("产品列表");
        wv.customBackAction(() => {
          if (this.count == 2) {
            btPage.goBack(100);
          } else {
            Toast('再按返回退出');
            this.count++;
            setTimeout(() => {
              this.count = 1;
            }, 2000);
          }
        });
        wv.setWebViewInfo({
          wvBackDisable: 1,
        });
    },
    components: {
        footerBar,lifeProductList
    }
};
</script>
