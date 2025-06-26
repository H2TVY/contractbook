<template>
  <form>
    <div class="mb-3 w-50 h-50">
      <img class="img-fluid img-thumbnail" src="#" alt="" />
      <input type="file" class="d-none" />
    </div>
    <div class="mb-3">
      <label for="name" class="form-label">Tên</label>
      <input name="name" type="text" class="form-control" />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">E-mail</label>
      <input name="email" type="email" class="form-control" />
    </div>
    <div class="mb-3">
      <label for="address" class="form-label">Địa chỉ</label>
      <input name="address" type="text" class="form-control" />
    </div>
    <div class="mb-3">
      <label for="phone" class="form-label">Điện thoại</label>
      <input name="phone" type="tel" class="form-control" />
    </div>

    <div class="mb-3 form-check">
      <input name="favorite" type="checkbox" class="form-check-input" />
      <label for="favorite" class="form-check-label">
        <strong>Liên hệ yêu thích</strong>
      </label>
    </div>

    <div class="mb-3">
      <button class="btn btn-primary"><i class="fas fa-save"></i> Lưu</button>
      <button type="button" class="ms-2 btn btn-danger">
        <i class="fas fa-trash"></i> Xóa
      </button>
    </div>
  </form>
</template>

<style scoped>
@import '@/assets/form.css';
</style>
