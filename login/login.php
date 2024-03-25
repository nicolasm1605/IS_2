<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Inicio de sesión</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Iniciar sesión</h1>
    </div>
    <div class="login-box">
      <form action="validar_login.php" method="post">
        <div class="input-group">
          <label for="username">Usuario:</label>
          <input type="text" id="username" name="username" required>
        </div>
        <div class="input-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" name="password" required>
        </div>
        <div class="button-group">
          <button type="submit" name="login">Iniciar sesión</button>
          <button type="button" name="register" onclick="window.location.href='../frontend_is2/registro.php'">Registrarse</button>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
