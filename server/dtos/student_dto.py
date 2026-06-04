class StudentDTO:
    def __init__(self,student_id, first_name: str, last_name: str, class_id: int, is_active: bool, password_hash: str):
        self.student_id = student_id
        self.first_name = first_name
        self.last_name = last_name
        self.class_id = class_id
        self.is_active = is_active
        self.password_hash = password_hash