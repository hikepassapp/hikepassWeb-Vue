<template>
  <div class="login-container">
    <div class="row g-0">
      <!-- Left Section - Sign In Form -->
      <div class="col-lg-6 col-md-6 col-12 left-section">
        <div class="form-wrapper">
          <h1 class="sign-in-title">Sign In</h1>

          <form @submit.prevent="handleLogin">
            <!-- Email Input -->
            <div class="mb-4">
              <div class="input-group">
                <input type="email" class="form-control custom-input" placeholder="Email" v-model="email" required />
                <span class="input-group-text input-icon">
                  <i class="bi bi-envelope"></i>
                </span>
              </div>
            </div>

            <!-- Password Input -->
            <div class="mb-4">
              <div class="input-group">
                <input :type="showPassword ? 'text' : 'password'" class="form-control custom-input"
                  placeholder="Password" v-model="password" required />
                <span class="input-group-text input-icon clickable" @click="togglePassword">
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </span>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <!-- Forgot Password -->
            <div class="text-center mb-4">
              <a href="#" @click.prevent="goToForgotPassword" class="forgot-password">Lupa kata sandi Anda?</a>
            </div>

            <!-- Sign In Button -->
            <div class="text-center">
              <button type="submit" class="btn btn-signin" :disabled="loading">
                {{ loading ? 'LOADING...' : 'SIGN IN' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Section - Welcome Message -->
      <div class="col-lg-6 col-md-6 col-12 right-section">
        <div class="welcome-wrapper">
          <h1 class="welcome-title">
            Selamat Datang<br />di Admin Hikepass!
          </h1>
          <p class="welcome-subtitle">
            Untuk Menjadi Admin Hikepass,<br />
            Anda Harus Menghubungi admin@hikepass.com.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../api/index.js'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      loading: false,
      errorMessage: '',
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.errorMessage = '';

      try {
        const { data } = await apiClient.post('/login', {
          email: this.email,
          password: this.password,
        });

        // Simpan token & user
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect berdasarkan role (siap dikembangkan)
        this.$router.push('/home');

      } catch (error) {
        console.error("Login Error:", error);
        this.errorMessage =
          error.response?.data?.message ||
          'Login gagal. Periksa email dan password.';
      } finally {
        this.loading = false;
      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    goToSignUp() {
      this.$router.push('/register');
    },

    goToForgotPassword() {
      this.$router.push('/forgot-password');
    },
  },
};
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
  position: relative;
}

.row {
  min-height: 100vh;
  margin: 0 !important;
  width: 100%;
}

/* Left Section - Sign In */
.left-section {
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
}

.form-wrapper {
  width: 100%;
  max-width: 460px;
}

.sign-in-title {
  font-size: 3rem;
  font-weight: 700;
  color: #1a4d4d;
  margin-bottom: 3rem;
  text-align: left;
}

.custom-input {
  background-color: #e0e0e0;
  border: none;
  border-radius: 30px;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  height: 60px;
}

.custom-input:focus {
  background-color: #d5d5d5;
  box-shadow: none;
  border: none;
}

.input-group-text {
  background-color: #e0e0e0;
  border: none;
  border-radius: 0 30px 30px 0;
  padding-right: 1.5rem;
}

.input-icon {
  cursor: default;
}

.input-icon.clickable {
  cursor: pointer;
}

.input-icon i {
  color: #888;
  font-size: 1.2rem;
}

.forgot-password {
  color: #1a4d4d;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-signin {
  background-color: #1a7a7a;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 4rem;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 1px;
  transition: background-color 0.3s ease;
}

.btn-signin:hover:not(:disabled) {
  background-color: #145f5f;
}

.btn-signin:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Right Section - Welcome */
.right-section {
  background: linear-gradient(135deg, #1a5555 0%, #0d3333 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
}

.welcome-wrapper {
  text-align: center;
  color: white;
}

.welcome-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  opacity: 0.95;
}



/* Alert Styles */
.alert {
  border-radius: 30px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  border: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sign-in-title {
    font-size: 2.5rem;
  }

  .welcome-title {
    font-size: 2.5rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .right-section {
    padding: 3rem 1.5rem;
  }

  .row {
    height: auto;
  }
}

@media (max-width: 576px) {
  .sign-in-title {
    font-size: 2rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .btn-signin {
    padding: 0.8rem 3rem;
  }
}
</style>