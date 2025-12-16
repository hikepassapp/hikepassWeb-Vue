<template>
  <div class="register-container">
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

      <!-- Right Section - Sign Up Form -->
      <div class="col-lg-6 col-md-6 col-12 right-section">
        <div class="form-wrapper">
          <h1 class="sign-up-title">Sign Up</h1>
          
          <form @submit.prevent="handleRegister">
            <!-- Phone or Email Input -->
            <div class="mb-4">
              <input
                type="text"
                class="form-control custom-input"
                placeholder="Masukkan Email"
                v-model="Email"
                required
              />
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
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterView',
  data() {
    return {
      // Sesuaikan variable dengan kebutuhan API Laravel
      name: '',
      email: '',
      password: '',
      password_confirmation: '' // Opsional, tapi praktik bagus
    }
  },
  methods: {
    async handleRegister() {
      try {
        // Kirim data ke endpoint register Laravel
        const response = await axios.post('http://127.0.0.1:8000/api/register', {
            name: this.name,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation
        });

        console.log('Register Berhasil:', response.data);
        
        // Opsional: Langsung simpan token biar user ga perlu login ulang
        localStorage.setItem('token', response.data.access_token);
        
        alert('Registrasi Berhasil! Silakan Login.');
        this.$router.push('/login');

      } catch (error) {
        console.error(error);
        // Tampilkan pesan error dari validasi Laravel (misal: email sudah dipakai)
        if (error.response && error.response.data.errors) {
            // Mengambil pesan error pertama
            const firstError = Object.values(error.response.data.errors)[0][0];
            alert(firstError); 
        } else {
            alert('Terjadi kesalahan saat registrasi.');
        }
      }
    },
    goToSignIn() {
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

.register-container {
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

/* Right Section - Sign Up Form */
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
  max-width: 500px;
}

.sign-up-title {
  font-size: 3rem;
  font-weight: 700;
  color: #1a4d4d;
  margin-bottom: 3rem;
  text-align: center;
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
  outline: none;
}

.custom-input::placeholder {
  color: #888;
}

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
  max-width: 300px;
}

.btn-signup-submit:hover {
  background-color: #145f5f;
}

.terms-text {
  text-align: center;
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
  padding: 0 2rem;
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

  .sign-up-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .welcome-title {
    font-size: 2.5rem;
  }

  .welcome-subtitle {
    font-size: 1.1rem;
  }

  .sign-up-title {
    font-size: 2.5rem;
  }

  .left-section,
  .right-section {
    padding: 3rem 1.5rem;
  }
}

@media (max-width: 576px) {
  .welcome-title {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .sign-up-title {
    font-size: 2rem;
  }

  .btn-signin,
  .btn-signup-submit {
    padding: 0.8rem 3rem;
  }

  .terms-text {
    font-size: 0.85rem;
    padding: 0 1rem;
  }

  .form-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  /* Reverse order on mobile - form on top, welcome message below */
  .row {
    flex-direction: column-reverse;
  }
  
  .left-section,
  .right-section {
    min-height: 50vh;
  }
}
</style>