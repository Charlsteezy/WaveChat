export function createUser(name: string) {
    // Write user to LocalStorage
    try {
        const id = Math.random().toString(36).substring(7);
        const imageUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${name}`;

        localStorage.setItem('user', JSON.stringify({ name, id, imageUrl }));

        return { name };
    } catch (error) {
        console.error('Error writing user to LocalStorage', error);
        return null;
    }
}