<template>
  <section>
    <!--    	<header class="top_tips">
    		<span class="num_tip" v-if="fatherComponent == 'home'">{{level}}</span>
    		<span class="num_tip" v-if="fatherComponent == 'item'">题目{{itemNum}}</span>
    </header>-->

    <div v-if="fatherComponent == 'home'">
      <div class="swj_home">
        <div class="swj_home_title"></div>
        <div class="swj_home_jx"></div>
        <div class="swj_home_leftcloud"></div>
        <div class="swj_home_rightcloud"></div>
        <div class="swj_home_city"></div>

        <div class="swj_home_btn swj_home_intro">活动介绍</div>
        <router-link class="swj_home_btn swj_home_test" to="item">开始测试</router-link>
      </div>
      <div class="swj_intro">
        <div class="swj_intro_panel">
          <div class="swj_intro_panelclose"></div>
        </div>
      </div>
    </div>

    <div v-if="fatherComponent == 'item'">
      <div class="item_back item_container_style">
        <div class="item_list_container" v-if="itemDetail.length > 0">
          <header class="item_title">{{ itemDetail[itemNum - 1].topic_name }}</header>
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
          <div v-if="itemNum === itemDetail.length" class="item_list_form">
            <form action>
              <div>
                <span>答卷人</span>
                <input type="text" v-model="Form.FormName" />
              </div>
              <div>
                <span>联系方式</span>
                <input type="text" v-model="Form.FormNum" />
              </div>
              <div>
                <span>邮寄地址</span>
                <input type="text" v-model="Form.FormAddress" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <span class="next_item button_style" @click="nextItem" v-if="itemNum < itemDetail.length"></span>
      <span class="submit_item button_style" v-else @click="submitAnswer"></span>
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
          } else if (this.answerid.length = this.itemDetail.length) {
            this.computedScore();
            this.UploadForm();
          } else {
            router.push("score");
          }
        }

        // if (this.answerid.length < this.itemDetail.length) {
        //   this.addNum(this.choosedId);
        //   if (
        //     this.Form.FormName == "" ||
        //     this.Form.FormNum == "" ||
        //     this.Form.FormAddress == ""
        //   ) {
        //     alert("请填写表格");
        //   } else if (!reg.test(this.Form.FormNum)) {
        //     alert("手机格式错误");
        //   } else {
        //     clearInterval(this.timer);
        //     this.computedScore();
        //     this.UploadForm();
        //   }
        // } else if ((this.answerid.length = this.itemDetail.length)) {
        //   if (
        //     this.Form.FormName == "" ||
        //     this.Form.FormNum == "" ||
        //     this.Form.FormAddress == ""
        //   ) {
        //     alert("请填写表格");
        //   } else if (!reg.test(this.Form.FormNum)) {
        //     alert("手机格式错误");
        //   } else {
        //     clearInterval(this.timer);
        //     this.computedScore();
        //     this.UploadForm();
        //   }
        // } else {
        //   this.$router.push("/");
        // }

        // alert(this.score);
      } else {
        alert("您还没有选择答案哦");
      }
    },
    BackHome(){
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
        .then(response=>{
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
  width: 10rem;
  span {
    display: inline-block;
    font-size: 0.6rem;
    color: #00e;
    vertical-align: middle;
  }
  .option_style {
    height: 0.725rem;
    width: 0.725rem;
    border: 1px solid #fff;
    border-radius: 50%;
    line-height: 0.725rem;
    text-align: center;
    margin-right: 0.3rem;
    font-size: 0.5rem;
    font-family: "Arial";
    &.has_choosed {
      span {
        display: block;
      }
    }
    &.has_true {
      span {
        display: block;
      }
    }
    span {
      display: none;
    }
  }
  .has_choosed {
    background-color: #ffd400;
    color: #575757;
    border-color: #ffd400;
  }
  .option_detail {
    width: 7.5rem;
    padding-top: 0.11rem;
  }
}
</style>
