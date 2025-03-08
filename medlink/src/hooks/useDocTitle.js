import { useEffect } from 'react';

const useDocTitle = (title) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} - MedLink`;
        } else {
            document.title = 'MedLink';
        }
    }, [title]);

    return null;
};

export default useDocTitle;