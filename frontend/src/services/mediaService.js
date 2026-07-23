import api from '@/lib/axios';

const mediaService = {
    /**
     * Uploads a file to Cloudinary via backend MediaController.
     * Only users with role CREATOR (or as configured on backend) can access /media/upload.
     * @param {File} file - The file to upload.
     * @returns {Promise<string>} The secure URL of the uploaded file.
     */
    upload: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data; // returns secure_url
        } catch (error) {
            console.error('Upload error at mediaService:', error);
            const errorMsg = error.response?.data?.message || 'Đã xảy ra lỗi khi tải file lên!';
            throw new Error(errorMsg);
        }
    }
};

export default mediaService;
