document.addEventListener('DOMContentLoaded', () => {
    const loginModalOverlay = document.getElementById('login-modal-overlay');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginErrorMessage = document.getElementById('login-error-message');
    const mainContent = document.getElementById('main-content');
    const tipsTbody = document.getElementById('tips-tbody');
    const filterForm = document.getElementById('filter-form');

    // Almacenará las credenciales para futuras peticiones
    let currentAuthHeader = null;

    // 1. Mostrar el modal de inicio de sesión al cargar la página
    loginModalOverlay.classList.remove('hidden');

    // 2. Manejar el envío del formulario de login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;

        // Codificar credenciales en Base64 para Basic Auth
        const credentials = btoa(`${username}:${password}`);
        const authHeader = `Basic ${credentials}`;

        try {
            // 3. Intentar obtener los datos de la API con las credenciales
            const response = await fetch('/api/tips', {
                headers: {
                    'Authorization': authHeader
                }
            });

            if (response.ok) {
                // 4. Si es exitoso, guardar credenciales y cargar dashboard
                currentAuthHeader = authHeader;
                loginModalOverlay.classList.add('hidden');
                mainContent.style.visibility = 'visible';
                loadTips(); // Cargar los registros en la tabla
            } else {
                // 5. Si falla, mostrar mensaje de error en el modal
                const data = await response.json();
                loginErrorMessage.textContent = data.error || 'Credenciales incorrectas.';
                loginErrorMessage.classList.remove('hidden');
            }
        } catch (error) {
            loginErrorMessage.textContent = 'No se pudo conectar con el servidor.';
            loginErrorMessage.classList.remove('hidden');
        }
    });

    // Ocultar el mensaje de error cuando el usuario escriba de nuevo
    usernameInput.addEventListener('input', () => loginErrorMessage.classList.add('hidden'));
    passwordInput.addEventListener('input', () => loginErrorMessage.classList.add('hidden'));
    
    // Función para cargar y mostrar los registros de propinas
    async function loadTips(filters = {}) {
        let url = '/api/tips';
        const params = new URLSearchParams();
        if (filters.waiterName) params.append('waiterName', filters.waiterName);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const queryString = params.toString();
        if (queryString) {
            url += `?${queryString}`;
        }

        try {
            const response = await fetch(url, {
                headers: { 'Authorization': currentAuthHeader }
            });
            if (!response.ok) {
                // Si la sesión expira o hay otro problema, mostrar modal de nuevo
                if(response.status === 401) {
                    loginModalOverlay.classList.remove('hidden');
                    mainContent.style.visibility = 'hidden';
                }
                throw new Error('No se pudieron cargar los datos.');
            }
            const tips = await response.json();
            renderTable(tips);
        } catch (error) {
            console.error('Error al cargar propinas:', error);
        }
    }

    // Función para renderizar los datos en la tabla
    function renderTable(tips) {
        tipsTbody.innerHTML = ''; // Limpiar la tabla
        if (tips.length === 0) {
            tipsTbody.innerHTML = '<tr><td colspan="5">No se encontraron registros.</td></tr>';
            return;
        }

        tips.forEach(tip => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tip.id}</td>
                <td>${tip.table_number}</td>
                <td>${tip.waiter_name}</td>
                <td>${tip.tip_percentage}%</td>
                <td>${new Date(tip.created_at).toLocaleString()}</td>
            `;
            tipsTbody.appendChild(row);
        });
    }

    // Manejar filtros
    filterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const waiterName = document.getElementById('waiter-filter').value;
        const startDate = document.getElementById('start-date-filter').value;
        const endDate = document.getElementById('end-date-filter').value;
        loadTips({ waiterName, startDate, endDate });
    });

    // Limpiar filtros
    document.getElementById('reset-filters-btn').addEventListener('click', () => {
        filterForm.reset();
        loadTips();
    });
});
