<?php

class AvatarsController extends BaseController {
	public function index() {
		if (!$this->resumeLogin()) {
			Flight::redirect('/signin'); //log out user with no view permision
		}
		else {
			if ($this->user->access < 5) {
				Flight::redirect('/signin');
			}
			else {
				$avatars = AvatarsModel::getAll();
				$total = AvatarsModel::count();

				$this->view->set('total', $total);
				$this->view->set('username', $this->user->username);
				$this->view->set('avatars', $avatars);
				$this->view->template = 'secondlife/avatars/index.html';
				$this->view->render();
			}
		}
	}

	public function view() {
		$result = array('success'=>false, 'error'=>'Unable to complete request');
		if($this->resumeLogin()) {
			if ($this->user->access >= 5) {
				$data = json_decode(file_get_contents("php://input"));
				if($data) { 
					if(isset($data->request)) {
						if($data->request == "page") {
							$result['newRows'] = AvatarsModel::getAll(intval($data->rows), intval($data->offset));
							$result['success'] = true; 
							unset($result['error']);
						}
						else if($data->request == "search") {
							$search = preg_replace('/[^a-zA-Z0-9_ -]/s', '', $data->input); 
							$result['newRows'] = AvatarsModel::search($search, intval($data->rows), intval($data->offset));
							$result['rowCount'] = AvatarsModel::search_count($search);
							$result['success'] = true; 
							unset($result['error']);
						}
					}
				}
			}
		}
		else {
			$result['signin'] = true;
		}
		echo json_encode($result);
	}

}

?>
