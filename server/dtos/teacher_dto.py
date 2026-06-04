class TeacherDTO:
    def __init__(self, teacher_id, password_hash, first_name, last_name, email, is_active, role):
        self.teacher_id = teacher_id
        self.password_hash = password_hash
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.is_active = is_active
        self.role = role