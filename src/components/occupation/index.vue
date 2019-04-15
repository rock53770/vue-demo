<template>
    <div class="ft14">
        <div class="bg-white h45 lh45 plr15 flex-center justify-sb van-hairline--bottom">
            <van-icon name="arrow-left" color="#909090" @click="levelBack"/>
            <span>职业类别</span>
            <van-icon name="cross" color="#909090" @click="hidePopup"/>
        </div>
        <div class="pt10 pb10 plr15 flex bg van-hairline--bottom">
            <span class="ws-n">已选：</span>
            <div class="">
                <p class="mb4">
                    <span>{{ selectObj.level1.name ? selectObj.level1.name : "" }}</span>
                    <span>{{ selectObj.level2.name ? ' — ' + selectObj.level2.name : "" }}</span>
                    <span>{{ selectObj.level3.name ? ' — ' + selectObj.level3.name : "" }}</span>
                </p>
                <p class="ft12" :class="attion.bingo?'cl-green':'cl-orange'" v-show="selectObj.level3.name && compare">类别：{{ attion.grade }}类{{ attion.bingo ?'（符合投保条件）':'（不符合投保条件）' }}</p>
                <!--不比较的时候显示职业类别-->
                <p class="ft12 cl-green" v-show="selectObj.level3.name && !compare">类别：{{ attion.grade }}类</p>
            </div>
        </div>
        <div class="bg-white pl15">
            <div class="lh45 pr15 van-hairline--bottom flex-center justify-sb"
                v-for="(item, index) in current" :key="index" @click="select(item, index)">
                <span>{{ item.name }}</span>
                <van-icon name="arrow" color="#CBCBCB" v-show="param.level !== 3"/>
        </div>
        </div>
    </div>
</template>
<script>
import lifeService from '../../api/lifeService'

export default {
    name: 'occ',
    props: {
        compare: { // 是否比较类别最大指
            type: Boolean,
            required: true
        },
        maxGrade: { // 选择职业类别最大类
            type: Number,
            required: false
        },
        minGrade: { // 选择职业类别最小类
            type: Number,
            required: false
        },
        companyId: { // 保险公司id
            type: Number,
            required: true
        }
    },
    data() {
        return {
            occ: [],
            level1: {}, // 一层级
            level2: {}, // 二层级
            level3: {}, // 三层级
            current: [],
            attion: {
                grade: 0,
                bingo: false
            },
            selectObj: {
                level1: {},
                level2: {},
                level3: {}
            },
            param: {
                level: 1,
                parentId: ""
            }
        }
    },
    methods: {
        getLevel(obj) {
			console.log('TCL: getLevel -> obj', obj)
            let param = {
                level: this.param.level,
                parentId: this.param.parentId,
                companyId: this.companyId
            }
            lifeService.getProfession(param)
                .then((res) => {
                    if (res.code == 1) {
                        if (this.param.level == 1) {
                            this.level1 = res.object
                            this.current = this.level1
                        } else if (this.param.level == 2) {
                            this.level2 = res.object
                            this.current = this.level2
                        } else {
                            this.level3 = res.object
                            this.current = this.level3
                        }
                    }
                })


        },
        select(obj, n) { // 选择项
            let param;
            if (obj.level !== 3) {
                if (obj.level == 1) {
                    this.selectObj.level1 = obj
                } else {
                    this.selectObj.level2 = obj
                }
                this.param.level = obj.level
                this.param.level++
                this.param.parentId = obj.id
                this.getLevel(this.param)
            } else {
                this.selectObj.level3 = obj
                this.attion.grade = obj.grade
                if (this.compare) {
                  if (obj.grade <= this.maxGrade && obj.grade >= this.minGrade) {
                    this.attion.bingo = true
                  } else {
                    this.attion.bingo = false
                  }

                } else {
                  this.attion.bingo = false;
                }
              this.$emit('getOcc', this.selectObj)
            }
        },
        levelBack() { // 等级回退
            let i = this.param.level
            switch(i) {
                case 1:
                    this.param.level = 1
                    this.param.id = ''
                    this.current = this.level1
                    break;
                case 2:
                    this.param.level = 1
                    this.param.id = ''
                    this.current = this.level1
                    this.selectObj.level2 = {}
                    break;
                case 3:
                    this.param.level = 2
                    this.param.id = ''
                    this.current = this.level2
                    this.selectObj.level3 = {}
                    break;
            }

        },
        hidePopup() { // 关闭popup
            this.$emit('hide')
        }
    },
    mounted() {
        this.getLevel(this.param)
    }
}
</script>
<style lang="less" scoped>
.ws-n {
    white-space: nowrap;
}
.cl-green {
    color: #0cb956;
}
</style>
