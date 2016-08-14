import React from 'react'
import AboutButton from '../ui/about.button'
import { Urls } from 'core/constants'

export default function DocumentsNavbar({
  isTemporaryUser, isAuthenticated,
  selectedDocument, documentIsSelected,
  createNewDocument, editDocument, deleteDocument,
  userName, toggleUserAccountModal, logOut
}) {

  const testDrive = isTemporaryUser && isAuthenticated

  return (
    <div className="toolbar">
      <div className="scroll-view">
        <AboutButton />
        <button
          className="button button--new"
          onClick={createNewDocument}
        >
          New
        </button>
        <button
          className="button button--edit"
          disabled={!documentIsSelected}
          onClick={editDocument}
        >
          Edit
        </button>
        <a
          className={`button button--pdf ${documentIsSelected ? '' : 'disabled'}`}
          href={selectedDocument ? `${Urls.ApiBase}/documents/${selectedDocument.id}/pdf` : ''}
          target="_blank"
        >
          PDF
        </a>
        <button
          className="button button--delete button-destructive"
          disabled={!documentIsSelected}
          onClick={deleteDocument}
        >
          Delete
        </button>
        <button
          className="button button--account"
          onClick={toggleUserAccountModal}
        >
          { isTemporaryUser ? 'Create Account' : 'Account' }
        </button>
        <button
          className="button button--logout"
          onClick={logOut}
        >
          { testDrive ? 'Exit Test Drive' : 'Log Out' }
        </button>
      </div>
    </div>
  )
}
