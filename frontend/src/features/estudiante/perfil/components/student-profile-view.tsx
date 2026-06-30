"use client";

import { PaymentModal } from "./payment-modal";
import { PersonalDataSection } from "./personal-data-section";
import { AvailabilitySection } from "./availability-section";
import { VisibilitySection } from "./visibility-section";
import { ProfileFormFooter } from "./profile-form-footer";
import { ProfilePreviewSection } from "./profile-preview-section";
import { PremiumVisibilitySection } from "./premium-visibility-section";
import { useStudentProfileView } from "./use-student-profile-view";

export function StudentProfileView() {
  const {
    profile,
    loading,
    saved,
    serverError,
    availability,
    showPayment,
    setShowPayment,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    toggleTurno,
    handleBoost,
    handlePaymentSuccess,
    onSubmit,
  } = useStudentProfileView();

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando perfil…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Perfil</p>
        <h1 className="mt-2 text-3xl font-black text-foreground">Mi perfil</h1>
        {profile && (
          <p className="mt-1 text-sm text-muted-foreground">
            {profile.faculty} · {profile.career} · Semestre {profile.semester}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <PersonalDataSection register={register} errors={errors} />
        <AvailabilitySection availability={availability} onToggle={toggleTurno} />
        <VisibilitySection register={register} />
        <ProfileFormFooter serverError={serverError} saved={saved} isSubmitting={isSubmitting} />
      </form>

      {profile && <ProfilePreviewSection profile={profile} />}

      <PremiumVisibilitySection isFeatured={!!profile?.is_featured} onBoost={handleBoost} />

      {showPayment && (
        <PaymentModal amount={5.0} onSuccess={handlePaymentSuccess} onClose={() => setShowPayment(false)} />
      )}
    </div>
  );
}
