<template>
    <div class="reset-container">
        <div class="row g-0">
            <!-- Left Section - Reset Password Form -->
            <div class="col-lg-6 col-md-6 col-12 left-section">
                <div class="form-wrapper">
                    <h1 class="title">Reset Password</h1>
                    <p class="subtitle">Masukkan password baru untuk akun Anda</p>

                    <form @submit.prevent="handleResetPassword">
                        <!-- New Password Input -->
                        <div class="mb-4">
                            <div class="input-group">
                                <input :type="showPassword ? 'text' : 'password'" class="form-control custom-input"
                                    placeholder="Password Baru" v-model="password" required minlength="6" />
                                <span class="input-group-text input-icon clickable" @click="togglePassword">
                                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                </span>
                            </div>
                            <small class="text-muted">Minimal 6 karakter</small>
                        </div>

                        <!-- Confirm Password Input -->
                        <div class="mb-4">
                            <div class="input-group">
                                <input :type="showConfirmPassword ? 'text' : 'password'"
                                    class="form-control custom-input" placeholder="Konfirmasi Password"
                                    v-model="passwordConfirmation" required minlength="6" />
                                <span class="input-group-text input-icon clickable" @click="toggleConfirmPassword">
                                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                </span>
                            </div>
                        </div>

                        <!-- Password Match Indicator -->
                        <div v-if="password && passwordConfirmation" class="mb-3">
                            <small :class="passwordsMatch ? 'text-success' : 'text-danger'">
                                <i :class="passwordsMatch ? 'bi bi-check-circle' : 'bi bi-x-circle'"></i>
                                {{ passwordsMatch ? 'Password cocok' : 'Password tidak cocok' }}
                            </small>
                        </div>

                        <!-- Error Message -->
                        <div v-if="errorMessage" class="alert alert-danger">
                            {{ errorMessage }}
                        </div>

                        <!-- Success Message -->
                        <div v-if="successMessage" class="alert alert-success">
                            {{ successMessage }}
                        </div>

                        <!-- Reset Button -->
                        <div class="text-center mb-3">
                            <button type="submit" class="btn btn-primary-custom"
                                :disabled="loading || !passwordsMatch || password.length < 6">
                                {{ loading ? 'Memproses...' : 'RESET PASSWORD' }}
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
                        <i class="bi bi-key"></i>
                    </div>
                    <h2 class="info-title">Buat Password Baru</h2>
                    <p class="info-text">
                        Password baru Anda harus berbeda<br />
                        dari password sebelumnya.
                    </p>
                    <div class="password-tips">
                        <h4>Tips Password Kuat:</h4>
                        <ul>
                            <li>Minimal 6 karakter</li>
                            <li>Gunakan kombinasi huruf dan angka</li>
                            <li>Tambahkan karakter spesial</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ResetPassword',
    data() {
        return {
            email: '',
            password: '',
            passwordConfirmation: '',
            showPassword: false,
            showConfirmPassword: false,
            loading: false,
            errorMessage: '',
            successMessage: ''
        }
    },
    computed: {
        passwordsMatch() {
            return this.password === this.passwordConfirmation && this.password.length > 0;
        }
    },
    mounted() {
        // Ambil email dari query params, route params, atau localStorage
        this.email =
            this.$route.query.email ||
            localStorage.getItem('resetEmail');

        if (!this.email) {
            alert('Email tidak ditemukan. Silakan mulai dari halaman Lupa Password.');
            this.$router.push('/forgot-password');
        }
    },
    methods: {
        async handleResetPassword() {
            if (!this.passwordsMatch) {
                this.errorMessage = 'Password tidak cocok';
                return;
            }

            if (this.password.length < 6) {
                this.errorMessage = 'Password minimal 6 karakter';
                return;
            }

            this.loading = true;
            this.errorMessage = '';
            this.successMessage = '';

            try {
                const response = await axios.post('http://127.0.0.1:8000/api/reset-password', {
                    email: this.email,
                    password: this.password,
                    password_confirmation: this.passwordConfirmation
                });

                this.successMessage = 'Password berhasil direset! Mengalihkan ke halaman login...';

                // Clear email dari localStorage
                localStorage.removeItem('resetEmail');

                // Redirect ke login setelah 2 detik
                setTimeout(() => {
                    this.$router.push('/login');
                }, 2000);

            } catch (error) {
                if (error.response && error.response.data) {
                    this.errorMessage = error.response.data.message || 'Gagal mereset password';
                } else {
                    this.errorMessage = 'Terjadi kesalahan. Silakan coba lagi.';
                }
            } finally {
                this.loading = false;
            }
        },
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        toggleConfirmPassword() {
            this.showConfirmPassword = !this.showConfirmPassword;
        },
        goToLogin() {
            localStorage.removeItem('resetEmail');
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

.reset-container {
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

.text-muted {
    display: block;
    margin-top: 0.5rem;
    margin-left: 1.5rem;
    font-size: 0.85rem;
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
    margin-bottom: 2rem;
}

.password-tips {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 1.5rem;
    text-align: left;
    max-width: 350px;
    margin: 0 auto;
}

.password-tips h4 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    font-weight: 600;
}

.password-tips ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.password-tips li {
    padding: 0.5rem 0;
    position: relative;
    padding-left: 1.5rem;
}

.password-tips li:before {
    content: "✓";
    position: absolute;
    left: 0;
    font-weight: bold;
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

    .password-tips {
        padding: 1rem;
    }
}
</style>