<template>
  <div class="forgot-container">
    <div class="row g-0">
      <!-- Left Section - Forgot Password Form -->
      <div class="col-lg-6 col-md-6 col-12 left-section">
        <div class="form-wrapper">
          <h1 class="title">Lupa Password?</h1>
          <p class="subtitle">Masukkan email Anda untuk menerima kode OTP</p>

          <form @submit.prevent="handleForgotPassword">
            <!-- Email Input -->
            <div class="mb-4">
              <div class="input-group">
                <input 
                  type="email" 
                  class="form-control custom-input" 
                  placeholder="Email" 
                  v-model="email" 
                  required 
                />
                <span class="input-group-text input-icon">
                  <i class="bi bi-envelope"></i>
                </span>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="alert alert-danger">
              {{ errorMessage }}
            </div>

            <!-- Success Message -->
            <div v-if="successMessage" class="alert alert-success">
              {{ successMessage }}
            </div>

            <!-- Send OTP Button -->
            <div class="text-center mb-3">
              <button type="submit" class="btn btn-primary-custom" :disabled="loading">
                {{ loading ? 'Mengirim...' : 'KIRIM KODE OTP' }}
              </button>
            </div>

            <!-- Back to Login -->
            <div class="text-center">
              <a href="#" @click.prevent="goToLogin" class="back-link">
                Kembali ke Sign In
              </a>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Section - Info -->
      <div class="col-lg-6 col-md-6 col-12 right-section">
        <div class="info-wrapper">
          <div class="icon-wrapper">
            <i class="bi bi-shield-lock"></i>
          </div>
          <h2 class="info-title">Reset Password</h2>
          <p class="info-text">
            Kami akan mengirimkan kode OTP ke email Anda.<br />
            Gunakan kode tersebut untuk mereset password Anda.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../api/index.js';

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      loading: false,
      errorMessage: '',
      successMessage: '',
    };
  },
  methods: {
    async handleForgotPassword() {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        await apiClient.post('/forgot-password', {
          email: this.email,
        });

        this.successMessage = 'Kode OTP telah dikirim ke email Anda!';

        // Redirect ke halaman Verify OTP
        setTimeout(() => {
          this.$router.push({
            name: 'VerifyOTP',
            params: { email: this.email },
          });
        }, 2000);

      } catch (error) {
        this.errorMessage =
          error.response?.data?.message ||
          'Email tidak ditemukan atau terjadi kesalahan.';
      } finally {
        this.loading = false;
      }
    },

    goToLogin() {
      this.$router.push('/login');
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

.forgot-container {
  min-height: 100vh;
  width: 100%;
  background-color: #f5f5f5;
  overflow: hidden;
}

.row {
  min-height: 100vh;
  margin: 0 !important;
  width: 100%;
}

/* Left Section */
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

.title {
  font-size: 3rem;
  font-weight: 700;
  color: #1a4d4d;
  margin-bottom: 1rem;
  text-align: left;
}

.subtitle {
  font-size: 1rem;
  color: #666;
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

.input-icon i {
  color: #888;
  font-size: 1.2rem;
}

.btn-primary-custom {
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

.btn-primary-custom:hover:not(:disabled) {
  background-color: #145f5f;
}

.btn-primary-custom:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-link {
  color: #1a4d4d;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
}

.back-link:hover {
  text-decoration: underline;
}

/* Right Section */
.right-section {
  background: linear-gradient(135deg, #1a5555 0%, #0d3333 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
}

.info-wrapper {
  text-align: center;
  color: white;
}

.icon-wrapper {
  margin-bottom: 2rem;
}

.icon-wrapper i {
  font-size: 5rem;
  opacity: 0.9;
}

.info-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.info-text {
  font-size: 1.1rem;
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

/* Responsive */
@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .info-title {
    font-size: 2rem;
  }

  .icon-wrapper i {
    font-size: 4rem;
  }
}

@media (max-width: 576px) {
  .title {
    font-size: 2rem;
  }

  .info-title {
    font-size: 1.8rem;
  }

  .btn-primary-custom {
    padding: 0.8rem 3rem;
  }
}
</style>