import { useState, forwardRef, useImperativeHandle } from 'react';
import { axiosInstance } from '@/axiosDefault.jsx';
import { useSelector, useDispatch } from 'react-redux'
import { updateUserPic } from '@/features/admin/useraccounts/adminUserAccountsSlice.jsx'
import Modal from 'react-bootstrap/Modal';
import Dropzone from 'react-dropzone'
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

const DragDropUserPicModal = forwardRef((props, ref) =>
{
  // Expose these functions to parent component.
  useImperativeHandle(ref, () => ({
    showModal(idv, utype) {
      setCloudGraphic(defaultCloudGraphic);
      setShow(true);
      setIdval(idv);
      setUsertype(utype);
    },
    hideModal() {
      setShow(false);
    }
  }));

  const onSuccess = props.onSuccess; // Callback allows parent component to do something with the picture.

  const handleClose = () => {
    setShow(false);
  };

  const [show, setShow] = useState(false);
  const [idval, setIdval] = useState(null);
  const [usertype, setUsertype] = useState(null);
  const defaultCloudGraphic = '/graphics/cloud-upload.png';
  const [cloudGraphic, setCloudGraphic] = useState(defaultCloudGraphic);
  const dispatch = useDispatch();
  const loginValue = useSelector(state => state.login.value);
  const isGoogleSignIn = (loginValue === null) ? false : (loginValue.loginType === 'Google Sign In');

  const googleProfileWarn = () => (
    <div>
      <b>
        This will not update your Google Profile image.
      </b>
    </div>
  );

  function handleDrop(acceptedFiles) {
    const file = acceptedFiles[0];
    if (file) {
      const url = window.location.origin + "/api/admin-userpic?idval=" + idval + "&usertype=" + usertype;
      const formData = new FormData();
      formData.append('file', file);
      const postConfig = {
        headers: { 'Content-Type': 'multipart/form-data' },
        //onUploadProgress: (progressEvent) => {
        //  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //  console.log(`   Uploading: ${percentCompleted}%`);
        //}
      };
      axiosInstance.post(url, formData, postConfig).then((response) => {

        // To help debug the production configuration for file upload path
        let dev_UploadPath = response.data.debug === 'C:\\path to\\                           RwASP\\reactwithasp.client\\public\\userpic';
        let prod_UploadPath = response.data.debug === 'C:\\path to\\RwASP-wwwroot\\wwwroot\\userpic';

        console.log('File uploaded successfully!', response.data);
        dispatch(updateUserPic({
          idval: response.data.idsave, // need to pass guest id
          picture: response.data.picture,
          usertype: usertype
        }));
        setCloudGraphic(response.data.picture);
        if (onSuccess) {
          onSuccess(response.data.picture)
        }
      })
      .catch((error) => {
        console.error('Request failed after retries.', error);
      })
      .finally(() => {
        console.log('Completed - handleDrop');
        handleClose();
      });
    }
  }

  const ddModalMarkup = function () {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Profile Image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Please choose an image for your user profile.<br />
            {isGoogleSignIn && googleProfileWarn()}
          </div>
          <br />
          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <div style={{ marginBottom: 10 }}>Click here to browse for a file, or drag and drop to upload.</div>
                  <div className="dragDropCont">
                    <Image className="cloudGraphic" src={cloudGraphic} rounded />
                  </div>
                </div>
              </section>
            )}
          </Dropzone>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClose}>
            &nbsp;Save&nbsp;
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <>
      {ddModalMarkup()}
    </>
  );
});

export default DragDropUserPicModal;