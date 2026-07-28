import { useState, useEffect } from 'react';

const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les permissions depuis le localStorage ou l'API
    const userPermissions = localStorage.getItem('userPermissions');
    if (userPermissions) {
      try {
        const parsedPermissions = JSON.parse(userPermissions);
        setPermissions(parsedPermissions);
      } catch (error) {
        console.error('Error parsing user permissions:', error);
        setPermissions([]);
      }
    }
    setLoading(false);
  }, []);

  const hasPermission = (permission) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (permissionList) => {
    return permissionList.some(permission => permissions.includes(permission));
  };

  const hasAllPermissions = (permissionList) => {
    return permissionList.every(permission => permissions.includes(permission));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    loading
  };
};

export default usePermissions;
