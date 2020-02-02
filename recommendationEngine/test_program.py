import test.mockdata_student as mockdata_student
import test.mockdata_teacher as mockdata_teacher

from main_lambda import execute_handler

result = execute_handler(mockdata_student, 1)
print(result)

result = execute_handler(mockdata_teacher, 1)
print(result)