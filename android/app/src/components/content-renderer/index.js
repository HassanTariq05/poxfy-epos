import React from 'react';
import {View} from 'react-native';
import {useStateContext} from '../state-provider';
import Dashboard from '../../screens/dashboard';
import CashRegister from '../../screens/pos/cash-resgister';
import Customer from '../../screens/customer/customer';
import Tag from '../../screens/customer/tag';
import Tier from '../../screens/customer/tier';
import Listing from '../../screens/pos/cash-resgister/listing';

const ContentRenderer = () => {
  const {selectedComponent} = useStateContext();

  const renderComponent = () => {
    console.log(selectedComponent);
    switch (selectedComponent.component) {
      case 'Dashboard':
        return <Dashboard />;
      case 'POS-Cash-Registers':
        return <Listing />;
      case 'Customer-Customer':
        return <Customer />;
      case 'Customer-Tag':
        return <Tag />;
      case 'Customer-Tier':
        return <Tier />;
      default:
        return <Dashboard />;
    }
  };

  return <View>{renderComponent()}</View>;
};

export default ContentRenderer;
