import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from '@chakra-ui/react';
import { useIntl } from 'react-intl';
import { useWeb3React } from '@web3-react/core';
import AccordionComponent from '../../../components/Accordion';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import { closeEditBar, saveProfile, selectShowEditBar } from '../slice';
import EditInfoForm from './EditInfoForm';
import EditColorsForm from './EditColorsForm';
import EditGroupsForm from './EditGroupsForm';

function ProfileEditDrawer() {
  const intl = useIntl();
  const showEditBar = useAppSelector(selectShowEditBar);
  const dispatch = useAppDispatch();
  const { account, library } = useWeb3React();
  const closeEdit = () => dispatch(closeEditBar());

  return (
    <Drawer size="md" isOpen={showEditBar} onClose={closeEdit} placement="right">
      <DrawerContent>
        <DrawerCloseButton onClick={closeEdit} />

        <DrawerHeader>
          {intl.formatMessage({ id: 'edit-profile-header', defaultMessage: 'Edit your profile' })}
        </DrawerHeader>

        <DrawerBody>
          <AccordionComponent
            items={[
              { header: intl.formatMessage({ id: 'info-form', defaultMessage: 'Info' }), body: <EditInfoForm /> },
              { header: intl.formatMessage({ id: 'colors-form', defaultMessage: 'Colors' }), body: <EditColorsForm /> },
              { header: intl.formatMessage({ id: 'groups-form', defaultMessage: 'Groups' }), body: <EditGroupsForm /> },
            ]}
          />
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" colorScheme="red" mr={3} onClick={closeEdit}>
            {intl.formatMessage({ id: 'close-edit-button', defaultMessage: 'Close' })}
          </Button>
          <Button colorScheme="brand" onClick={() => dispatch(saveProfile({ address: account!, library }))}>
            {intl.formatMessage({ id: 'save-edits-button', defaultMessage: 'Save' })}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default ProfileEditDrawer;