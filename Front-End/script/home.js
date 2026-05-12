        function openPanel(section) {
            document.getElementById('overlay').classList.add('open');
            document.getElementById('profilePanel').classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closePanel() {
            document.getElementById('overlay').classList.remove('open');
            document.getElementById('profilePanel').classList.remove('open');
            document.body.style.overflow = '';
        }

        function logout() {
            localStorage.removeItem('emailUsuario');
            localStorage.removeItem('tokenOrientec');
            window.location.href = 'index.html';
        }