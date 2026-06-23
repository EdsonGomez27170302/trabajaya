package main

import (
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"trabajaya-backend/internal/models"
)

func hash(pw string) string {
	b, err := bcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	return string(b)
}

var students = []struct {
	username  string
	email     string
	firstName string
	lastName  string
	instEmail string
	faculty   string
	career    string
	semester  int
	phone     string
	bio       string
	zone      string
	photo     string
}{
	{"carlos_quispe", "carlos.quispe@gmail.com", "Carlos", "Quispe Huamán", "c.quispe@unsch.edu.pe", "Ingeniería", "Ingeniería de Sistemas", 6, "966123001", "Estudiante de sistemas con experiencia en soporte técnico y desarrollo web. Disponible fines de semana.", "Huamanga", "/uploads/students/estudiante-1.jpg"},
	{"lucia_flores", "lucia.flores@gmail.com", "Lucía", "Flores Cárdenas", "l.flores@unsch.edu.pe", "Ciencias Económicas", "Administración de Empresas", 5, "966123002", "Busco prácticas en área administrativa o ventas. Manejo de Office y atención al cliente.", "Carmen Alto", "/uploads/students/estudiante-2.jpg"},
	{"jose_mendoza", "jose.mendoza@gmail.com", "José", "Mendoza Palomino", "j.mendoza@unsch.edu.pe", "Ingeniería", "Ingeniería Civil", 7, "966123003", "Ayudo en obras, levantamiento topográfico y diseño con AutoCAD. Horario flexible entre semana.", "San Juan Bautista", "/uploads/students/estudiante-3.jpg"},
	{"ana_vargas", "ana.vargas@gmail.com", "Ana", "Vargas Ccencho", "a.vargas@unsch.edu.pe", "Ciencias de la Salud", "Enfermería", 4, "966123004", "Estudiante de Enfermería con disponibilidad para cuidado de personas mayores o apoyo en clínicas.", "Jesús Nazareno", "/uploads/students/estudiante-4.jpg"},
	{"miguel_torres", "miguel.torres@gmail.com", "Miguel", "Torres Rimachi", "m.torres@unsch.edu.pe", "Educación", "Educación Primaria", 6, "966123005", "Doy clases particulares de matemáticas y comunicación para primaria y secundaria. Tardes libres.", "Centro", "/uploads/students/estudiante-5.jpg"},
	{"sofia_huanca", "sofia.huanca@gmail.com", "Sofía", "Huanca Díaz", "s.huanca@unsch.edu.pe", "Ciencias Económicas", "Contabilidad", 5, "966123006", "Apoyo en registro contable, facturación y conciliación bancaria. Manejo de Excel avanzado.", "Huamanga", "/uploads/students/estudiante-6.jpg"},
	{"david_ccasa", "david.ccasa@gmail.com", "David", "Ccasa Huaytalla", "d.ccasa@unsch.edu.pe", "Ingeniería", "Ingeniería de Sistemas", 8, "966123007", "Desarrollador web con conocimiento en React y Go. Busco trabajo remoto o presencial part-time.", "Andrés Avelino Cáceres", "/uploads/students/estudiante-7.jpg"},
	{"rosa_galindo", "rosa.galindo@gmail.com", "Rosa", "Galindo Sulca", "r.galindo@unsch.edu.pe", "Ciencias Sociales", "Trabajo Social", 3, "966123008", "Disponible para labores de campo, encuestas y atención comunitaria. Con movilidad propia.", "San Juan Bautista", "/uploads/students/estudiante-8.jpg"},
	{"kevin_pari", "kevin.pari@gmail.com", "Kevin", "Pari Quispe", "k.pari@unsch.edu.pe", "Ingeniería", "Ingeniería Electrónica", 6, "966123009", "Técnico en mantenimiento eléctrico y electrónico. Disponible sábados y domingos todo el día.", "Centro", ""},
	{"diana_ochoa", "diana.ochoa@gmail.com", "Diana", "Ochoa Berrocal", "d.ochoa@unsch.edu.pe", "Ciencias Económicas", "Marketing", 4, "966123010", "Creo contenido para redes sociales, diseño gráfico básico en Canva y gestión de campañas digitales.", "Huamanga", ""},
	{"alex_ayala", "alex.ayala@gmail.com", "Álex", "Ayala Ccorahua", "a.ayala@unsch.edu.pe", "Ciencias de la Salud", "Nutrición y Dietética", 5, "966123011", "Oriento en planes de alimentación saludable. Disponible para trabajo en clínicas o empresas.", "Carmen Alto", ""},
	{"nadia_quispe", "nadia.quispe@gmail.com", "Nadia", "Quispe Fernández", "n.quispe@unsch.edu.pe", "Ingeniería", "Ingeniería Agroindustrial", 7, "966123012", "Conocimientos en control de calidad alimentaria y gestión de procesos. Busco prácticas.", "Jesús Nazareno", ""},
	{"roberto_huari", "roberto.huari@gmail.com", "Roberto", "Huari Ccopa", "r.huari@unsch.edu.pe", "Ciencias Económicas", "Economía", 6, "966123013", "Apoyo en análisis de datos, elaboración de informes y proyecciones. Manejo de SPSS y Excel.", "Andrés Avelino Cáceres", ""},
	{"valeria_pariona", "valeria.pariona@gmail.com", "Valeria", "Pariona Asto", "v.pariona@unsch.edu.pe", "Educación", "Educación Inicial", 4, "966123014", "Cuidado de niños, apoyo en jardines y centros educativos. Paciente y responsable.", "San Juan Bautista", ""},
	{"frank_condori", "frank.condori@gmail.com", "Frank", "Condori Quispe", "f.condori@unsch.edu.pe", "Ingeniería", "Ingeniería de Minas", 7, "966123015", "Experiencia en seguridad minera y operación de equipos pesados. Disponible para trabajos de campo.", "Centro", ""},
}

func main() {
	dsn := "host=localhost user=postgres password=1234 dbname=trabajaya port=5432 sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("no se pudo conectar a la base de datos: %v", err)
	}

	pw := hash("Estudiante123!")

	for _, s := range students {

		var count int64
		db.Model(&models.User{}).Where("username = ?", s.username).Count(&count)
		if count > 0 {
			log.Printf("skip (existe): %s", s.username)
			continue
		}

		user := models.User{
			Username:     s.username,
			Email:        s.email,
			PasswordHash: pw,
			Role:         "student",
			IsVerified:   true,
			IsActive:     true,
		}
		if err := db.Create(&user).Error; err != nil {
			log.Printf("error creando usuario %s: %v", s.username, err)
			continue
		}

		profile := models.StudentProfile{
			UserID:             user.ID,
			FirstName:          s.firstName,
			LastName:           s.lastName,
			InstitutionalEmail: s.instEmail,
			Faculty:            s.faculty,
			Career:             s.career,
			Semester:           s.semester,
			Phone:              s.phone,
			Bio:                s.bio,
			Zone:               s.zone,
			ProfilePhoto:       s.photo,
			IsAvailable:        true,
		}
		if err := db.Create(&profile).Error; err != nil {
			log.Printf("error creando perfil %s: %v", s.username, err)
			continue
		}

		log.Printf("creado: %s %s (%s)", s.firstName, s.lastName, s.instEmail)
	}

	log.Println("seed completado")
}
