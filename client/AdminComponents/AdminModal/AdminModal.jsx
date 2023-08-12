import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

const AdminModal = ({ text, isOpen, onClose, onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Вы действительно хотите удалить {text}?</ModalHeader>
        <ModalBody>Это действие не обратимо</ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Отмена
          </Button>
          <Button
            colorScheme="red"
            onClick={(e) => {
              onSubmit(e);
              onClose(e);
            }}
          >
            Удалить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AdminModal;
