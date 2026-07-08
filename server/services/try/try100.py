
from werkzeug.security import check_password_hash
password_hash = check_password_hash("scrypt:32768:8:1$yvEVXgVQfLiMO5Ft$fd7571ea830ceaad17d20e23fbc3e618d69d1059a66335bdd75e2e67b6db38d6b18f919a2e5992772b554197bf49fc687254b3ccdb463e4d70df4eecccd80a05","123456")
print(password_hash)

# from werkzeug.security import generate_password_hash
#
# password_hash = generate_password_hash("123456")
# print(password_hash)