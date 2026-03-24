(() => {
    const SUPABASE_URL = typeof window.SUPABASE_URL === 'string' ? window.SUPABASE_URL.trim() : '';
    const SUPABASE_ANON_KEY = typeof window.SUPABASE_ANON_KEY === 'string' ? window.SUPABASE_ANON_KEY.trim() : '';
    const USERS_TABLE = typeof window.SUPABASE_USERS_TABLE === 'string' && window.SUPABASE_USERS_TABLE.trim()
        ? window.SUPABASE_USERS_TABLE.trim()
        : 'users';
    const supabaseLibrary = window.supabase;
    const isSupabaseReady = Boolean(
        SUPABASE_URL &&
        SUPABASE_ANON_KEY &&
        supabaseLibrary &&
        typeof supabaseLibrary.createClient === 'function'
    );

    let supabaseClient = null;

    function getSupabaseClient() {
        if (!isSupabaseReady) {
            throw new Error('Supabase is not configured. Check supabase-config.js.');
        }

        if (!supabaseClient) {
            supabaseClient = supabaseLibrary.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        }

        return supabaseClient;
    }

    function getSupabaseErrorMessage(error, fallbackMessage) {
        if (!error) {
            return fallbackMessage;
        }

        if (error.code === '23505' || String(error.message).toLowerCase().includes('duplicate')) {
            return 'Email already registered.';
        }

        return error.message || fallbackMessage;
    }

    function toUserErrorMessage(error) {
        const message = error && error.message ? error.message : '';
        return message || 'Unexpected error';
    }

    async function fetchMessages() {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
            .from(USERS_TABLE)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(getSupabaseErrorMessage(error, 'Failed to fetch messages'));
        }

        return Array.isArray(data) ? data : [];
    }

    async function loadMessages() {
        const messagesDisplay = document.getElementById('messagesDisplay');
        messagesDisplay.innerHTML = '<div class="loading">Loading messages...</div>';

        try {
            const messages = await fetchMessages();
            document.getElementById('messageCount').textContent = `Total: ${messages.length} messages`;

            if (messages.length === 0) {
                messagesDisplay.innerHTML = '<div class="no-messages">No messages yet. Check back later!</div>';
                return;
            }

            messagesDisplay.innerHTML = messages.map((msg) => `
                <div class="message-item">
                    <div class="message-header">
                        <div>
                            <div class="message-name">${escapeHtml(msg.name)}</div>
                            <div class="message-email">${escapeHtml(msg.email)}</div>
                        </div>
                        <div style="text-align: right;">
                            <div class="message-time">${formatDate(msg.created_at)}</div>
                            <button class="delete-btn" onclick="deleteMessage(${msg.id})">Delete</button>
                        </div>
                    </div>
                    <div class="message-content">${escapeHtml(msg.message)}</div>
                </div>
            `).join('');
        } catch (error) {
            messagesDisplay.innerHTML = `<div class="no-messages">Error loading messages: ${toUserErrorMessage(error)}</div>`;
            console.error('Error:', error);
        }
    }

    async function deleteMessage(messageId) {
        if (!confirm('Are you sure you want to delete this message?')) {
            return;
        }

        try {
            const supabase = getSupabaseClient();
            const { error } = await supabase.from(USERS_TABLE).delete().eq('id', messageId);

            if (error) {
                throw new Error(getSupabaseErrorMessage(error, 'Failed to delete message'));
            }

            await loadMessages();
        } catch (error) {
            alert('Error deleting message: ' + toUserErrorMessage(error));
            console.error('Error:', error);
        }
    }

    async function deleteAllMessages() {
        if (!confirm('Delete ALL messages? This cannot be undone.')) {
            return;
        }

        try {
            const messages = await fetchMessages();
            if (messages.length === 0) {
                await loadMessages();
                return;
            }

            const ids = messages.map((msg) => msg.id).filter((id) => Number.isInteger(id));
            if (ids.length === 0) {
                await loadMessages();
                return;
            }

            const supabase = getSupabaseClient();
            const { error } = await supabase.from(USERS_TABLE).delete().in('id', ids);
            if (error) {
                throw new Error(getSupabaseErrorMessage(error, 'Failed to delete messages'));
            }

            await loadMessages();
        } catch (error) {
            alert('Error deleting messages: ' + toUserErrorMessage(error));
            console.error('Error:', error);
        }
    }

    async function exportToText() {
        try {
            const messages = await fetchMessages();

            if (messages.length === 0) {
                alert('No messages to export');
                return;
            }

            let textContent = '='.repeat(80) + '\n';
            textContent += 'CONTACT MESSAGES EXPORT\n';
            textContent += 'Generated: ' + new Date().toLocaleString() + '\n';
            textContent += '='.repeat(80) + '\n\n';

            messages.forEach((msg, index) => {
                textContent += `Message #${index + 1}\n`;
                textContent += '-'.repeat(80) + '\n';
                textContent += `Name: ${msg.name}\n`;
                textContent += `Email: ${msg.email}\n`;
                textContent += `Date: ${formatDate(msg.created_at)}\n`;
                textContent += `\nMessage:\n${msg.message}\n\n`;
            });

            textContent += '='.repeat(80) + '\n';
            textContent += `Total Messages: ${messages.length}\n`;
            textContent += '='.repeat(80);

            downloadFile(textContent, 'messages.txt');
        } catch (error) {
            alert('Error exporting messages: ' + toUserErrorMessage(error));
            console.error('Error:', error);
        }
    }

    function downloadFile(content, filename) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    function formatDate(dateString) {
        if (!dateString) return 'Unknown';
        const date = new Date(dateString);
        return date.toLocaleString();
    }

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function toggleMenu() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('active');
        }
    }

    window.loadMessages = loadMessages;
    window.deleteMessage = deleteMessage;
    window.deleteAllMessages = deleteAllMessages;
    window.exportToText = exportToText;
    window.toggleMenu = toggleMenu;

    window.addEventListener('load', loadMessages);
})();
