document.addEventListener('DOMContentLoaded', () => {
    // --- VARIABLES Y SELECTORES DE ELEMENTOS ---
    let currentTipsData = [];

    const mainContent = document.getElementById('main-content');
    const tbody = document.getElementById('tips-tbody');
    const filterForm = document.getElementById('filter-form');
    // ... mas selectores de filtros ...
    const waiterFilterInput = document.getElementById('waiter-filter');
    const startDateInput = document.getElementById('start-date-filter');
    const endDateInput = document.getElementById('end-date-filter');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const totalRecordsSpan = document.getElementById('total-records');
    const averageTipSpan = document.getElementById('average-tip');

    // Selectores para el nuevo modal de login
    const loginOverlay = document.getElementById('login-modal-overlay');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginErrorMessage = document.getElementById('login-error-message');

    // --- LÓGICA DE AUTENTICACIÓN Y MODAL ---
    function showLoginModal(message = '') {
        mainContent.style.visibility = 'hidden';
        loginOverlay.classList.remove('hidden');
        if (message) {
            loginErrorMessage.textContent = message;
            loginErrorMessage.classList.remove('hidden');
        } else {
            loginErrorMessage.classList.add('hidden');
        }
    }

    function hideLoginModal() {
        loginOverlay.classList.add('hidden');
        mainContent.style.visibility = 'visible';
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        const auth = 'Basic ' + btoa(`${username}:${password}`);
        
        sessionStorage.setItem('kiosk-auth', auth);
        fetchAndRenderTips(); // Intentamos cargar los datos con las nuevas credenciales
    });

    // --- LÓGICA PRINCIPAL DE DATOS ---
    async function fetchAndRenderTips() {
        const authHeader = sessionStorage.getItem('kiosk-auth');
        if (!authHeader) {
            showLoginModal();
            return;
        }

        const params = new URLSearchParams();
        if (waiterFilterInput.value) params.append('waiter', waiterFilterInput.value);
        if (startDateInput.value) params.append('startDate', startDateInput.value);
        if (endDateInput.value) params.append('endDate', endDateInput.value);
        
        const url = `/api/tips?${params.toString()}`;
        
        try {
            tbody.innerHTML = '<tr><td colspan="5">Cargando datos...</td></tr>';
            const response = await fetch(url, {
                headers: { 'Authorization': authHeader }
            });

            if (response.status === 401) { // No autorizado
                sessionStorage.removeItem('kiosk-auth');
                showLoginModal('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
                return;
            }
            if (!response.ok) {
                throw new Error('La respuesta del servidor no fue exitosa.');
            }

            const tips = await response.json();
            currentTipsData = tips;
            
            hideLoginModal(); // Si todo salió bien, ocultamos el modal
            renderTable(tips);
            updateTotals(tips);

        } catch (error) {
            console.error('Error al obtener los datos:', error);
            // Si hay un error de red, podríamos mostrar el login también
            showLoginModal(`Error de conexión: ${error.message}`);
        }
    }

    // --- FUNCIONES DE RENDERIZADO (sin cambios) ---
    function renderTable(tips) {
        tbody.innerHTML = '';
        if (tips.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No se encontraron registros.</td></tr>';
            return;
        }
        tips.forEach(tip => {
            const tr = document.createElement('tr');
            const localDate = new Date(tip.created_at).toLocaleString('es-MX', {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
            tr.innerHTML = `<td>${tip.id}</td><td>${tip.table_number}</td><td>${tip.waiter_name}</td><td>${tip.tip_percentage}%</td><td>${localDate}</td>`;
            tbody.appendChild(tr);
        });
    }

    function updateTotals(tips) {
        totalRecordsSpan.textContent = tips.length;
        if (tips.length > 0) {
            const avg = tips.reduce((sum, tip) => sum + tip.tip_percentage, 0) / tips.length;
            averageTipSpan.textContent = `${avg.toFixed(1)}%`;
        } else {
            averageTipSpan.textContent = '0%';
        }
    }

    // --- MANEJO DE EVENTOS (sin cambios, excepto el de exportación) ---
    filterForm.addEventListener('submit', e => { e.preventDefault(); fetchAndRenderTips(); });
    resetFiltersBtn.addEventListener('click', () => { filterForm.reset(); fetchAndRenderTips(); });
    exportCsvBtn.addEventListener('click', () => {
        if (currentTipsData.length === 0) {
            alert('No hay datos para exportar.');
            return;
        }
        const headers = ['ID', 'Numero de Mesa', 'Nombre Mesero', 'Porcentaje Propina', 'Fecha y Hora'];
        const csvRows = [
            headers.join(','),
            ...currentTipsData.map(tip => {
                const localDate = `"${new Date(tip.created_at).toLocaleString('es-MX')}"`;
                return [tip.id, tip.table_number, `"${tip.waiter_name}"`, tip.tip_percentage, localDate].join(',');
            })
        ];
        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `reporte_propinas_${new Date().toISOString().split('T')[0]}.csv`);
        a.click();
    });

    // --- INICIALIZACIÓN ---
    fetchAndRenderTips();
});
