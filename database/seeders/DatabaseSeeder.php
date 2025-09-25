<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Log::info('Starting database seeding process...');

        try {
            // Step 1: Create roles first
            $this->call(RolesTableSeeder::class);
            Log::info('✓ Roles seeded successfully');

            // Step 2: Create permissions
            $this->call(PermissionsTableSeeder::class);
            Log::info('✓ Permissions seeded successfully');

            // Step 3: Assign permissions to roles
            $this->call(PermissionRoleTableSeeder::class);
            Log::info('✓ Permission-Role relationships seeded successfully');

            // Step 4: Create users
            $this->call(UsersTableSeeder::class);
            Log::info('✓ Users seeded successfully');

            // Step 5: Assign roles to users
            $this->call(RoleUserTableSeeder::class);
            Log::info('✓ User-Role relationships seeded successfully');

            // Step 6: Additional seeders (if any)
            // Uncomment the seeders you have available
           
            $this->call([
                ContactTypeSeeder::class,
                ContactSeeder::class,
                PaymentTypeTableSeeder::class,
                BankTableSeeder::class,
                TwoDLimitSeeder::class,
                ChooseDigitSeeder::class,
                WinnerTextSeeder::class,
                HeadCloseSeeder::class,
                TwoDLimitSeeder::class,
                BattleTableSeeder::class,
                // Add other seeders as needed
                GameTypeTableSeeder::class,
            GscPlusProductTableSeeder::class,
            GameTypeProductTableSeeder::class,
            PragmaticPlaySlotGameListSeeder::class,
            SEOGameListSeeder::class,
            YEEBETGameListSeeder::class,
            PlayTechGameSeeder::class,
            PlayTechLiveCasinoGameSeeder::class,
            //JokerSlotGameSeeder::class,
            //JokerOtherGameSeeder::class,
            //JokerFishingGameSeeder::class,
            SAGamingCasinoGameSeeder::class,
            SpadeGamingSlotGameSeeder::class,
            SpadeGamingFishingGameSeeder::class,
            Live22SlotGameSeeder::class,
            WMCasinoGameSeeder::class,
            //HabaneroSlotGameSeeder::class,
            AWCSlotGameSeeder::class,
            AWCFishingGameSeeder::class,
            SabaSportBookGameSeeder::class,
            PGSoftSlotGameSeeder::class,
            PragmaticPlayLiveCasinoPremiumGameSeeder::class,
            PragmaticPlayVirtualSportGameSeeder::class,
            PragmaticPlayLiveCasinoGameSeeder::class,
            DreamGamingSeeder::class,
            // BigGamingFishingSeeder::class,
            //EvoPlayGameSeeder::class,
            JDBSLOTGameSeeder::class,
            JDBSFishingameSeeder::class,
            JDBOtherGameSeeder::class,
            PlayStarGameSeeder::class,
            //CT855CasinoGameSeeder::class,
            CQ9SlotGameSeeder::class,
            CQ9FishingGameSeeder::class,
            JILISlotGameSeeder::class,
            JILICasinoGameSeeder::class,
            JILIFishingGameSeeder::class,
            JILIPokerGameSeeder::class,
            HACKSAWSlotGameSeeder::class,
            // HACKSAWOtherGameSeeder::class,
            ImoonOtherGameSeeder::class,
            EpicwinGameSeeder::class,
            FACHAISLOTGameSeeder::class,
            FACHAIFishingGameSeeder::class,
            Rich88SlotGameSeeder::class,
            N2SlotGameSeeder::class,
            AILiveCasinoGameSeeder::class,
            AIPokerGameSeeder::class,
            SmartSoftGameSeeder::class,
            WorldEntertainmentSlotGameSeeder::class,
            IBCSPORTBOOKSeeder::class,
            //IBCVIRTUAL_SPORTSeeder::class,
            //IBCOTHERSeeder::class,
            advantplaySeeder::class,
            MRSlottySlotSeeder::class,
            MRSlottyLOTTERYSeeder::class,
            MRSlottyOTHERSeeder::class,
            MRSlottyPlayAceSlotSeeder::class,
            PlayAceLIVE_CASINOSeeder::class,
            BoomingGamesSlotSeeder::class,
            SpribeOtherSeeder::class,
            WOWGamingPokerSeeder::class,
            WOWGamingSLOTSeeder::class,
            WOWGamingP2PSeeder::class,
            BIGPOTSlotSeeder::class,
            pascal_gamingSlotSeeder::class,
            MrSlotyBoonGoSlotSeeder::class,
            MrSlotyFaziSlotSeeder::class,
            MrSlotyFelixSlotSeeder::class,
            MrSlotyFuntaSlotSeeder::class,
            MrSlotyGamingWorldSlotSeeder::class,
            MrSlotyKAGamingSlotSeeder::class,
            MrSlotyKironSlotSeeder::class,
            MrSlotyVoltSlotSeeder::class,
            MrSlotyRerakeSlotSeeder::class,
            MrSlotyZuesPlaySlotSeeder::class
            ]);
            

            Log::info('✓ All additional seeders completed successfully');
            Log::info('🎉 Database seeding completed successfully!');

        } catch (\Exception $e) {
            Log::error('❌ Database seeding failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }
}