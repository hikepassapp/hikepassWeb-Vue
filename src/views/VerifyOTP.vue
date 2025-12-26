<template>
  <div class="verify-container">
    <div class="row g-0">
      <!-- Left Section - Verify OTP Form -->
      <div class="col-lg-6 col-md-6 col-12 left-section">
        <div class="form-wrapper">
          <h1 class="title">Verifikasi OTP</h1>
          <p class="subtitle">
            Masukkan 6 digit kode yang telah dikirim ke<br />
            <strong>{{ email }}</strong>
          </p>

          <form @submit.prevent="handleVerifyOTP">
            <!-- OTP Input -->
            <div class="mb-4">
              <div class="otp-inputs">
                <input v-for="(digit, index) in otpDigits" :key="index" type="text" maxlength="1" class="otp-input"
                  v-model="otpDigits[index]" @input="handleInput(index, $event)" @keydown="handleKeydown(index, $event)"
                  :ref="'otpInput' + index" />
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

            <!-- Verify Button -->
            <div class="text-center mb-3">
              <button type="submit" class="btn btn-primary-custom" :disabled="loading || otp.length !== 6">
                {{ loading ? 'Memverifikasi...' : 'VERIFIKASI' }}
              </button>
            </div>

            <!-- Resend OTP -->
            <div class="text-center mb-3">
              <p class="resend-text">
                Tidak menerima kode?
                <a href="#" @click.prevent="resendOTP" class="resend-link">
                  Kirim Ulang
                </a>
              </p>
            </div>

            <!-- Back -->
            <div class="text-center">
              <a href="#" @click.prevent="goBack" class="back-link">
                Kembali
              </a>
            </div>
          </form>
        </div>
      </div>

      <!-- Right Section - Info -->
      <div class="col-lg-6 col-md-6 col-12 right-section">
        <div class="info-wrapper">
          <div class="icon-wrapper">
            <i class="bi bi-envelope-check"></i>
          </div>
          <h2 class="info-title">Cek Email Anda</h2>
          <p class="info-text">
            Kode OTP telah dikirim ke email Anda.<br />
            Silakan cek inbox atau folder spam.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'VerifyOTP',
  data() {
    return {
      email: '',
      otpDigits: ['', '', '', '', '', ''],
      loading: false,
      errorMessage: '',
      successMessage: ''
    }
  },
  computed: {
    otp() {
      return this.otpDigits.join('');
    }
  },
  mounted() {
    // Ambil email dari query params, route params, atau localStorage
    this.email = this.$route.query.email || this.$route.params.email || localStorage.getItem('resetEmail') || '';

    if (!this.email) {
      alert('Email tidak ditemukan. Silakan mulai dari halaman Lupa Password.');
      this.$router.push('/forgot-password');
      return;
    }

    // Focus ke input pertama
    this.$nextTick(() => {
      if (this.$refs.otpInput0 && this.$refs.otpInput0[0]) {
        this.$refs.otpInput0[0].focus();
      }
    });
  },
  methods: {
    handleInput(index, event) {
      const value = event.target.value;

      // Hanya izinkan angka
      if (!/^\d*$/.test(value)) {
        this.otpDigits[index] = '';
        return;
      }

      this.otpDigits[index] = value;

      // Auto focus ke input berikutnya
      if (value && index < 5) {
        const nextInput = this.$refs['otpInput' + (index + 1)];
        if (nextInput && nextInput[0]) {
          nextInput[0].focus();
        }
      }
    },
    handleKeydown(index, event) {
      // Handle backspace
      if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
        const prevInput = this.$refs['otpInput' + (index - 1)];
        if (prevInput && prevInput[0]) {
          prevInput[0].focus();
        }
      }
    },
    async handleVerifyOTP() {
      if (this.otp.length !== 6) {
        this.errorMessage = 'Silakan masukkan kode OTP lengkap';
        return;
      }

      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/verify-otp', {
          email: this.email,
          otp: this.otp
        });

        this.successMessage = 'Verifikasi berhasil! Mengalihkan...';

        // Simpan email untuk halaman reset password
        localStorage.setItem('resetEmail', this.email);

        // Redirect ke halaman Reset Password
        setTimeout(() => {
          this.$router.push({
            name: 'ResetPassword',
            query: { email: this.email }
          });
        }, 1500);

      } catch (error) {
        if (error.response && error.response.data) {
          this.errorMessage = error.response.data.message || 'Kode OTP tidak valid atau sudah kadaluarsa';
        } else {
          this.errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
        }
      } finally {
        this.loading = false;
      }
    },
    async resendOTP() {
      try {
        await axios.post('http://127.0.0.1:8000/api/forgot-password', {
          email: this.email
        });

        // Clear OTP inputs
        this.otpDigits = ['', '', '', '', '', ''];
        this.errorMessage = '';
        this.successMessage = 'Kode OTP baru telah dikirim!';

        // Focus ke input pertama
        if (this.$refs.otpInput0 && this.$refs.otpInput0[0]) {
          this.$refs.otpInput0[0].focus();
        }

        // Clear success message setelah 3 detik
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);

      } catch (error) {
        this.errorMessage = 'Gagal mengirim ulang kode OTP';
      }
    },
    goBack() {
      this.$router.push('/forgot-password');
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.verify-container {
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

/* OTP Inputs */
.otp-inputs {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.otp-input {
  width: 60px;
  height: 60px;
  background-color: #e0e0e0;
  border: none;
  border-radius: 15px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a4d4d;
  transition: all 0.3s ease;
}

.otp-input:focus {
  background-color: #d5d5d5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(26, 122, 122, 0.3);
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

.resend-text {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.resend-link {
  color: #1a7a7a;
  text-decoration: none;
  font-weight: 600;
}

.resend-link:hover {
  text-decoration: underline;
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

  .otp-input {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
}

@media (max-width: 576px) {
  .title {
    font-size: 2rem;
  }

  .info-title {
    font-size: 1.8rem;
  }

  .otp-input {
    width: 45px;
    height: 45px;
    font-size: 1.2rem;
  }

  .btn-primary-custom {
    padding: 0.8rem 3rem;
  }
}
</style>