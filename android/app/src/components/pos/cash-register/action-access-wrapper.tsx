import React from 'react';
import {useSelector} from 'react-redux';
import {View, Text} from 'react-native';
import {getUserPermissions} from '../../../redux/feature/auth-slice';

interface ActionWrapperWrapperProps {
  permissionKeys: any;
  children: any;
}

const ActionAccessWrapper: React.FC<ActionWrapperWrapperProps> = ({
  permissionKeys,
  children,
}) => {
  const allowedPermissionFromStore = useSelector(getUserPermissions) || {};

  // If the user is a master user, show all children components
  if (allowedPermissionFromStore.masterUser === true) {
    return <>{children}</>;
  } else {
    // Check if the user has the required permission
    const isValid = allowedPermissionFromStore?.permissions?.some(
      (data: any) => data?.key === permissionKeys,
    );

    // If the user has the permission, show children
    if (isValid) {
      return <>{children}</>;
    }

    // If no permission, return a fallback view (e.g., empty view or a message)
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text>You do not have permission to view this content.</Text>
      </View>
    );
  }
};

export default ActionAccessWrapper;
