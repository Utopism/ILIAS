<?php
/* Copyright (c) 1998-2009 ILIAS open source, Extended GPL, see docs/LICENSE */

require_once 'Modules/Chatroom/classes/class.ilChatroom.php';
require_once 'Modules/Chatroom/classes/class.ilChatroomUser.php';

/**
 * Class ilChatroomBanTask
 *
 * @author Jan Posselt <jposselt@databay.de>
 * @version $Id$
 *
 * @ingroup ModulesChatroom
 */
class ilChatroomBanTask extends ilChatroomTaskHandler
{
	/**
	 * Displays banned users task.
	 *
	 * @global ilCtrl2 $ilCtrl
	 */
	public function show()
	{
		//global $lng, $ilCtrl;
		global $ilCtrl;

		include_once 'Modules/Chatroom/classes/class.ilChatroom.php';

		ilChatroom::checkUserPermissions( 'read', $this->gui->ref_id );

		$this->gui->switchToVisibleMode();

		require_once 'Modules/Chatroom/classes/class.ilBannedUsersTableGUI.php';

		$table = new ilBannedUsersTableGUI( $this->gui, 'ban-show' );
		$table->setFormAction( $ilCtrl->getFormAction( $this->gui, 'ban-show' ) );

		$room = ilChatroom::byObjectId( $this->gui->object->getId() );

		if( $room )
		{
			$table->setData( $room->getBannedUsers() );
		}

		$this->gui->tpl->setVariable( 'ADM_CONTENT', $table->getHTML() );
	}

	/**
	 * Unbans users fetched from $_REQUEST['banned_user_id'].
	 *
	 * @global ilCtrl2 $ilCtrl
	 */
	public function delete()
	{
		/**
		 * @var $ilCtrl ilCtrl
		 * @var $lng ilLanguage
		 */
		global $ilCtrl, $lng;

		$users = $_REQUEST['banned_user_id'];

		if( !is_array( $users ) )
		{
			ilUtil::sendInfo($lng->txt('no_checkbox'), true);
			$ilCtrl->redirect( $this->gui, 'ban-show' );
		}

		$room = ilChatroom::byObjectId( $this->gui->object->getId() );
		$room->unbanUser( $users );

		$ilCtrl->redirect( $this->gui, 'ban-show' );
	}

	/**
	 * Calls $this->show method.
	 *
	 * @param string $method
	 * @return mixed
	 */
	public function executeDefault($method)
	{
		$this->show();
	}

	/**
	 * Kicks and bans user, fetched from $_REQUEST['user'] and adds history entry.
	 */
	public function active()
	{
	    $this->redirectIfNoPermission(array('read', 'moderate'));

		$room = ilChatroom::byObjectId($this->gui->object->getId());
		$subRoomId = $_REQUEST['sub'];
		$userToBan = $_REQUEST['user'];

		$this->exitIfNoRoomExists($room);

		$connector      = $this->gui->getConnector();
		$response       = $connector->sendBan($room->getRoomId(), $subRoomId, $userToBan); // @TODO Respect Scope

		if($this->isSuccessful($response))
		{
			$room->banUser($_REQUEST['user']);
			$room->disconnectUser($_REQUEST['user']);
		}

		$this->sendResponse($response);
	}
}

?>