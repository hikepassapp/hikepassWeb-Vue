<template>
  <div class="top-navbar">
    <div class="navbar-content">
      <h3 class="page-title">{{ pageTitle }}</h3>
      
      <div class="user-section">
        <span class="user-name">Admin 02</span>
        <div class="user-avatar">
          <i class="bi bi-person-circle"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopNavbar',
  props: {
    pageTitle: {
      type: String,
      default: 'Dashboard'
    }
  }
}
</script>

<style scoped>
.top-navbar {
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 99;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.user-name {
  color: #666;
  font-weight: 500;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .top-navbar {
    padding: 1rem 1.5rem;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .user-name {
    display: none;
  }
}
</style>