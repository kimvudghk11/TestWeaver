import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column,
    CreateDateColumn,
    UpdateDateColumn, 
} from 'typeorm';

// DB 테이블 이름 지정
@Entity('users')
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: string; // bigint는 JS에서 정밀도 문제로 string으로 처리하는 것인 안전함

    @Column({ name: 'login_id', length: 50, unique: true})
    loginId: string; // 로그인 아이디 (유니크)

    @Column({ length: 255, unique: true})
    email: string; // 이메일 (유니크)

    @Column({ length: 50 })
    name: string; // 사용자 이름

    // 보안상 코드에서는 passwordHash보다 password라고 부르는 것이 직관적일 때가 많지만,
    // 기존 DB 컬럼명과의 매핑으 명확히 보여주기 위해 아래와 같이 설정
    @Column({ name: 'password_hash', length: 255})
    password: string;

    @Column({ length:20, nullable:true })
    phone: string | null; // 전화번호 (nullable)

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean; // 활성화 여부

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date; // 생성 일시

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date; // 수정 일시
}
