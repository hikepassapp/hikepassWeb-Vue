<template>
  <div class="register-data-container">
    <div class="row g-0">
      <!-- Left Section - Welcome Back Message -->
      <div class="col-lg-6 col-md-6 col-12 left-section">
        <div class="welcome-wrapper">
          <h1 class="welcome-title">
            Selamat Datang<br />Kembali di Hikepass!
          </h1>
          <p class="welcome-subtitle">
            Masuk untuk lanjutkan perjalananmu!
          </p>
          <button class="btn btn-signin" @click="goToSignIn">
            SIGN IN
          </button>
        </div>
      </div>

      <!-- Right Section - Registration Form -->
      <div class="col-lg-6 col-md-6 col-12 right-section">
        <div class="form-wrapper">
          <div class="form-card">
            <!-- Back Button and Title -->
            <div class="header-section">
              <button class="btn-back" @click="goBack">
                <i class="bi bi-arrow-left"></i>
              </button>
              <h2 class="form-title">Daftar dengan E-mail</h2>
            </div>

            <form @submit.prevent="handleRegister">
              <!-- Email Input (Read-only / Pre-filled) -->
              <div class="mb-3">
                <input
                  type="email"
                  class="form-control custom-input"
                  :value="email"
                  readonly
                  disabled
                />
              </div>

              <!-- Username Input -->
              <div class="mb-3">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control custom-input with-icon"
                    placeholder="Masukkan username"
                    v-model="username"
                    required
                  />
                  <span class="input-group-text input-icon">
                    <i class="bi bi-person"></i>
                  </span>
                </div>
              </div>

              <!-- Password Input -->
              <div class="mb-4">
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    class="form-control custom-input with-icon"
                    placeholder="Masukkan password"
                    v-model="password"
                    required
                  />
                  <span 
                    class="input-group-text input-icon clickable"
                    @click="togglePassword"
                  >
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </span>
                </div>
              </div>

              <!-- Sign Up Button -->
              <div class="text-center mb-4">
                <button type="submit" class="btn btn-signup-submit">
                  SIGN UP
                </button>
              </div>

              <!-- Terms and Conditions -->
              <div class="terms-text">
                <p>
                  Dengan mendaftar, saya menyetujui 
                  <a href="#" class="terms-link">Syarat & Ketentuan</a> 
                  serta 
                  <a href="#" class="terms-link">Kebijakan Privasi HikePass</a>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterDataView',
  data() {
    return {
      email: 'dhea@gmail.com', // Pre-filled from previous page
      username: '',
      password: '',
      showPassword: false
    }
  },
  mounted() {
    // Get email from route params or query
    if (this.$route.query.email) {
      this.email = this.$route.query.email;
    }
  },
  methods: {
    handleRegister() {
      console.log('Register Data:', {
        email: this.email,
        username: this.username,
        password: this.password
      });
      
      // Tambahkan logic register di sini
      // Misalnya kirim data ke backend untuk create account
      // Setelah sukses, redirect ke dashboard atau halaman verifikasi
      this.$router.push('/dashboard');
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    goBack() {
      // Kembali ke halaman register sebelumnya
      this.$router.back();
    },
    goToSignIn() {
      // Navigasi ke halaman sign in
      this.$router.push('/login');
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

.register-data-container {
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

/* Left Section - Welcome Back */
.left-section {
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
  max-width: 500px;
}

.welcome-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  opacity: 0.95;
}

.btn-signin {
  background-color: white;
  color: #1a5555;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 4rem;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.btn-signin:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Right Section - Form */
.right-section {
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
}

.form-wrapper {
  width: 100%;
  max-width: 550px;
}

.form-card {
  background-color: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
}

/* Header Section */
.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.btn-back {
  background: none;
  border: none;
  color: #1a4d4d;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-back:hover {
  transform: translateX(-3px);
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a4d4d;
  margin: 0;
}

/* Form Inputs */
.custom-input {
  background-color: #e8e8e8;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  height: 50px;
  width: 100%;
}

.custom-input:disabled,
.custom-input:read-only {
  background-color: #e8e8e8;
  color: #666;
  cursor: not-allowed;
}

.custom-input.with-icon {
  border-radius: 8px 0 0 8px;
}

.custom-input:focus {
  background-color: #dcdcdc;
  box-shadow: none;
  border: none;
  outline: none;
}

.custom-input::placeholder {
  color: #999;
}

.input-group-text {
  background-color: #e8e8e8;
  border: none;
  border-radius: 0 8px 8px 0;
  padding: 0 1rem;
}

.input-icon {
  cursor: default;
}

.input-icon.clickable {
  cursor: pointer;
}

.input-icon i {
  color: #666;
  font-size: 1.1rem;
}

/* Button */
.btn-signup-submit {
  background-color: #1a7a7a;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.9rem 4rem;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 1px;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 250px;
}

.btn-signup-submit:hover {
  background-color: #145f5f;
}

/* Terms Text */
.terms-text {
  text-align: center;
  font-size: 0.85rem;
  color: #555;
  line-height: 1.6;
}

.terms-text p {
  margin: 0;
}

.terms-link {
  color: #1a7a7a;
  text-decoration: none;
  font-weight: 600;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 992px) {
  .welcome-title {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2.5rem;
  }

  .welcome-subtitle {
    font-size: 1.1rem;
  }

  .form-title {
    font-size: 1.3rem;
  }

  .left-section,
  .right-section {
    padding: 3rem 1.5rem;
  }

  .form-card {
    padding: 2rem 1.5rem;
  }

  /* Reverse order on mobile */
  .row {
    flex-direction: column-reverse;
  }
  
  .left-section,
  .right-section {
    min-height: 50vh;
  }
}

@media (max-width: 576px) {
  .welcome-title {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .form-title {
    font-size: 1.2rem;
  }

  .btn-signin,
  .btn-signup-submit {
    padding: 0.8rem 3rem;
  }

  .terms-text {
    font-size: 0.8rem;
  }

  .form-card {
    padding: 1.5rem 1rem;
  }
}
</style>