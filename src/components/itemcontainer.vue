<template>
  <section>
    <!--    	<header class="top_tips">
    		<span class="num_tip" v-if="fatherComponent == 'home'">{{level}}</span>
    		<span class="num_tip" v-if="fatherComponent == 'item'">题目{{itemNum}}</span>
    </header>-->

    <div
      v-if="fatherComponent == 'home'"
      style="position: relative;
    height: 100%;
    width: 100%;"
    >
      <div class="swj_home">
        <div class="swj_home_title"></div>
        <div class="swj_home_jx"></div>
        <div class="swj_home_leftcloud"></div>
        <div class="swj_home_rightcloud"></div>
        <div class="swj_home_city"></div>

        <div class="swj_home_btn swj_home_intro" @click="IntroShow=true">活动介绍</div>
        <router-link class="swj_home_btn swj_home_test" to="item">开始测试</router-link>
        <div class="swj_home_author">东方网政务中心设计制作</div>
      </div>

      <div class="swj_intro" v-show="IntroShow">
        <div class="swj_intro_block"></div>
        <div class="swj_intro_title"></div>
        <div class="swj_intro_jx"></div>
        <div class="swj_intro_city"></div>
        <div class="swj_intro_panel">
          <p>我们赖以生存的地球是一个非常美丽的蓝色星球，其中仅有2.53%是淡水。而所有淡水资源中，可为人类所获取和使用的不足1%。这样一来是什么概念呢？假设地球上总水量有2台洗衣机（50L）那么多，淡水只有大概2.5L可乐瓶那么多，而能被我们获得和使用的仅有。</p>
        </div>
        <div class="swj_intro_panelclose" @click="IntroShow=false"></div>
      </div>
    </div>

    <div
      v-if="fatherComponent == 'item'"
      style="position: relative;
    height: 100%;
    width: 100%;"
    >
      <div class="swj_form swj_intro">
        <!-- <div class="swj_intro_block"></div> -->
        <div class="swj_intro_title"></div>
        <div class="swj_intro_jx"></div>
        <div class="swj_intro_city"></div>
        <div class="swj_intro_panel">
          <div class="swj_form_container" v-if="itemDetail.length > 0">
            <header class="swj_form_title">{{ itemDetail[itemNum - 1].active_title }}</header>
            <ul>
              <li
                v-for="(item, index) in itemDetail[itemNum - 1].topic_answer"
                @click="
                choosed(index, item.topic_answer_id, item.is_standard_answer)
              "
                class="item_list"
              >
                <span
                  class="option_style"
                  v-bind:class="{
                  has_choosed: choosedNum == index,
                  has_true: Trueindex == index
                }"
                >
                  <span class="option_style_symbol">
                    {{
                    chooseType(item.is_standard_answer)
                    }}
                  </span>

                  <!-- <img :src="chooseType(item.is_standard_answer)" /> -->
                </span>
                <!-- <span class="option_style" v-bind:class="{'has_choosed':choosedNum==index}">{{chooseType(index)}}</span> -->
                <span class="option_detail">{{ item.answer_name }}</span>
              </li>
            </ul>
          <div v-if="itemNum === itemDetail.length" class="item_list_form swj_form_scoreform">
            <form action>
              <div class="swj_form_scoreform-li">
                <span>答 卷 人        &nbsp:</span>
                <input type="text" v-model="Form.FormName" />
              </div>
              <div class="swj_form_scoreform-li">
                <span>联系方式 :</span>
                <input type="text" v-model="Form.FormNum" />
              </div>
              <div class="swj_form_scoreform-li">
                <span>邮寄地址 :</span>
                <!-- <input type="text" v-model="Form.FormAddress" style="height:2rem;" /> -->
                <textarea name="" id="" cols="30" rows="10" v-model="Form.FormAddress" style="height:2rem;"></textarea>
              </div>
            </form>
          </div>
          </div>

        </div>
        <div
          class="swj_home_btn swj_form_btn"
          @click="nextItem"
          v-if="itemNum < itemDetail.length"
        >下一题</div>

        <span class="swj_home_btn swj_form_btn" v-else @click="submitAnswer" style="padding: 0 1.2rem;">提交答案</span>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { mapState, mapActions } from "vuex";
import _ from "lodash";
// import router from '../router/router.js';
// import router from 'vue-router';
export default {
  name: "itemcontainer",
  data() {
    return {
      IntroShow: false,
      itemId: null, //题目ID
      choosedNum: null, //选中答案索引
      choosedId: null, //选中答案id
      // HasChoosed:false
      HasClick: false,
      HascomputedScore: false,
      Trueindex: null,
      score: 0, //分数
      rightAnswer: [2, 7, 12, 13, 18], //正确答案
      Form: {
        FormName: "",
        FormNum: "",
        FormAddress: ""
      }
    };
  },
  props: ["fatherComponent"],
  computed: mapState([
    "itemNum", //第几题
    "level", //第几周
    "itemDetail", //题目详情
    "timer", //计时器
    "answerid"
  ]),
  methods: {
    ...mapActions(["addNum", "initializeData"]),
    // IntroShowClick(){
    //   this.IntroShow=true;
    // },
    // IntroHideClick(){
    //   this.IntroShow=false;
    // },
    //点击下一题
    nextItem() {
      if (this.choosedNum !== null) {
        this.choosedNum = null;
        this.Trueindex = null;
        this.HasClick = false;
        //保存答案, 题目索引加一，跳到下一题
        this.addNum(this.choosedId);
      } else {
        alert("您还没有选择答案哦");
      }
    },
    //索引0-3对应答案A-B
    chooseType: type => {
      switch (type) {
        case 0:
          return "❌";
        case 1:
          return "✔";
      }
    },
    // TrueFalse
    //选中的答案信息
    choosed(type, id, TrueFalse) {
      if (!this.HasClick) {
        this.choosedNum = type;
        this.choosedId = id;
        this.HasClick = true;
      }

      // this.HasChoosed=true;
      // console.log(TrueFalse);
      // var index = this.itemDetail[this.itemNum-1].findIndex(function(item) {
      //     return item.is_standard_answer === 1;
      // });
      var Trueindex = _.findIndex(
        this.itemDetail[this.itemNum - 1].topic_answer,
        function(o) {
          return o.is_standard_answer === 1;
        }
      );
      this.Trueindex = Trueindex;
    },
    computedScore() {
      if (!this.HascomputedScore) {
        this.answerid.forEach((item, index) => {
          if (item == this.rightAnswer[index]) {
            this.score += 20;
          }
        });
        this.HascomputedScore = true;
      }
    },
    //到达最后一题，交卷，请空定时器，跳转分数页面
    submitAnswer() {
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.choosedNum !== null) {
        // if()
        if (
          this.Form.FormName == "" ||
          this.Form.FormNum == "" ||
          this.Form.FormAddress == ""
        ) {
          alert("请填写表格");
        } else if (!reg.test(this.Form.FormNum)) {
          alert("手机格式错误");
        } else {
          if (this.answerid.length < this.itemDetail.length) {
            this.addNum(this.choosedId);
            // clearInterval(this.timer);
            this.computedScore();
            this.UploadForm();
          } else if ((this.answerid.length = this.itemDetail.length)) {
            this.computedScore();
            this.UploadForm();
          } else {
            router.push("score");
          }
        }
      } else {
        alert("您还没有选择答案哦");
      }
    },
    BackHome() {
      this.$router.push("score");
    },
    UploadForm() {
      console.log(this.score);
      // console.log(this.choosedNum);
      // console.log(this.choosedId);
      console.log(this.itemDetail.length);
      // answerid
      console.log(this.answerid);
      console.log(this.answerid.length);
      var fromData = new FormData();
      fromData.append("Name", this.Form.FormName);
      fromData.append("Mobile", this.Form.FormNum);
      fromData.append("Address", this.Form.FormAddress);
      fromData.append("Score", this.score);
      axios
        .post("http://dev.odb.sh.cn/SHSWJHSYKTZXDT/Home/Information", fromData)
        .then(response => {
          console.log(response);
          if (response.data.Status == 300) {
            alert(response.data.Msg);
          } else {
            // router.push("score");
            alert(response.data.Msg);
            this.$router.push("score");
          }
        })
        //获取失败
        .catch(error => {
          console.log(error);
          alert("网络错误，不能访问");
        });
    }
  },
  created() {
    //初始化信息

    // 页面刷新保留数据未做
    // https://www.cnblogs.com/xieli26/p/9947391.html

    if (this.fatherComponent == "home") {
      this.initializeData();
      document.body.style.backgroundImage = "url(./static/img/home.jpg)";
    }
    if (this.fatherComponent == "item") {
      // this.initializeData();
      document.body.style.backgroundImage = "url(./static/img/home.jpg)";
    }
  }
};
</script>

<style lang="less">
@import "../style/itemContainer.less";
.top_tips {
  position: absolute;
  height: 7.35rem;
  width: 3.25rem;
  top: -1.3rem;
  right: 1.6rem;
  background: url(../images/WechatIMG2.png) no-repeat;
  background-size: 100% 100%;
  z-index: 10;
  .num_tip {
    position: absolute;
    left: 0.48rem;
    bottom: 1.1rem;
    height: 0.7rem;
    width: 2.5rem;
    font-size: 0.6rem;
    font-family: "黑体";
    font-weight: 600;
    color: #a57c50;
    text-align: center;
  }
}
.item_container_style {
  height: 11.625rem;
  width: 13.15rem;
  background-repeat: no-repeat;
  position: absolute;
  top: 4.1rem;
  left: 1rem;
}
.home_logo {
  background-image: url(../images/1-2.png);
  background-size: 13.142rem 100%;
  background-position: right center;
}
.item_back {
  background-image: url(../images/2-1.png);
  background-size: 100% 100%;
}
.button_style {
  display: block;
  height: 2.1rem;
  width: 4.35rem;
  background-size: 100% 100%;
  position: absolute;
  top: 16.5rem;
  left: 50%;
  margin-left: -2.4rem;
  background-repeat: no-repeat;
}
.start {
  background-image: url(../images/1-4.png);
}
.next_item {
  background-image: url(../images/2-2.png);
}
.submit_item {
  background-image: url(../images/3-1.png);
}
.item_list_container {
  position: absolute;
  height: 7rem;
  // width: 8rem;
  top: 2.4rem;
  left: 3rem;
  -webkit-font-smoothing: antialiased;
}
.item_title {
  font-size: 0.65rem;
  color: #00e;
  line-height: 0.7rem;
}
.item_list {
font-size: 0;
    margin-top: 0.4rem;
    width: 8.2rem;
    overflow: hidden;
  span {
    display: block;
    font-size: 0.36rem;
    color: #1a568e;
    vertical-align: middle;
  }
  .option_style {
    float: left;
    height: 0.4rem;
    width: 0.4rem;
    border: 1px solid #000;
    border-radius: 50%;
    line-height: 0.4rem;
    text-align: center;
    margin-right: 0.3rem;
    font-size: 0.5rem;
    font-family: "Arial";
    margin-top: 0.05rem;
    &.has_choosed {
      span {
        display: block;
        font-size: 0.45rem;
      }
    }
    &.has_true {
      span {
        display: block;
        color: #50ae00;
        font-size: 0.7rem;
      }
    }
    span {
      display: none;
    }
  }
  .has_choosed {
    // background-color: #ffd400;
    // color: #575757;
    // border-color: #ffd400;
  }
  .option_detail {
    width: 7.5rem;
    float: left;
  }
}
</style>
