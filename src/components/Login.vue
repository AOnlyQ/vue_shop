<template>
    <div class="login_container">
      <div class="login_box">
        <div class="avatar_box">
          <img src="../assets/logo.png" alt="">
        </div>
        <!-- 登录表单区域 -->
        <!-- 加ref引用，ref="loginFormRef" 以拿到该表单组件 -->
        <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
          <!-- 账号 -->
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单s数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 登录表单验证规则对象
      loginFormRules: {
          username: [
            { required: true, message: '请输入登录账号', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
      }
    }
  },
  methods: {
    resetLoginForm: function() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login: function() {
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;
        const {data:res} = await this.$http.post('login',this.loginForm);
        // console.log(res);
        if(res.meta.status !== 200) return this.$message.error('登录失败!');
        this.$message.success('登录成功!');
        window.sessionStorage.setItem('token', res.data.token);
        this.$router.push('/home');
      })
    }

  }
}
</script>
// scoped用于控制组件的样式生效区间，加上scoped则表示该样式只在当前组件内生效
<style lang="less" scoped>
  .login_container {
    background: #2b4b6b;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);

  }
  .avatar_box {
    width: 130px;
    height: 130px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
