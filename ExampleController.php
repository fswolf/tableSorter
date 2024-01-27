<?php

class AvatarsController {
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
