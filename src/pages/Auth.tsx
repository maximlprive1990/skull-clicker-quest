 import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from '@/hooks/useAuth';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { toast } from 'sonner';
 import { Skull, Mail, Lock, Loader2 } from 'lucide-react';
 
 const Auth = () => {
   const [isLogin, setIsLogin] = useState(true);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const { signIn, signUp } = useAuth();
   const navigate = useNavigate();
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
 
     try {
       if (isLogin) {
         const { error } = await signIn(email, password);
         if (error) {
           toast.error(error.message);
         } else {
           toast.success('Connexion réussie!');
           navigate('/');
         }
       } else {
         const { error } = await signUp(email, password);
         if (error) {
           toast.error(error.message);
         } else {
           toast.success('Inscription réussie! Vérifie ton email pour confirmer.');
         }
       }
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
       <div className="w-full max-w-sm space-y-8">
         {/* Logo */}
         <div className="text-center">
           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-green/20 mb-4">
             <Skull className="w-12 h-12 text-neon-green" />
           </div>
           <h1 className="font-display text-4xl text-neon-green tracking-wider">
             Skull Clicker
           </h1>
           <p className="text-muted-foreground mt-2">
             {isLogin ? 'Connecte-toi pour continuer' : 'Crée ton compte'}
           </p>
         </div>
 
         {/* Form */}
         <form onSubmit={handleSubmit} className="space-y-4">
           <div className="relative">
             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
             <Input
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="pl-10 bg-card border-neon-green/30 focus:border-neon-green"
               required
             />
           </div>
           
           <div className="relative">
             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
             <Input
               type="password"
               placeholder="Mot de passe"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="pl-10 bg-card border-neon-green/30 focus:border-neon-green"
               required
               minLength={6}
             />
           </div>
 
           <Button
             type="submit"
             disabled={loading}
             className="w-full bg-neon-green hover:bg-neon-green/80 text-background font-bold py-6 text-lg"
           >
             {loading ? (
               <Loader2 className="w-5 h-5 animate-spin" />
             ) : isLogin ? (
               'Se connecter'
             ) : (
               "S'inscrire"
             )}
           </Button>
         </form>
 
         {/* Toggle */}
         <div className="text-center">
           <button
             type="button"
             onClick={() => setIsLogin(!isLogin)}
             className="text-neon-green hover:underline"
           >
             {isLogin
               ? "Pas encore de compte? S'inscrire"
               : 'Déjà un compte? Se connecter'}
           </button>
         </div>
 
         {/* Play without account */}
         <div className="text-center pt-4 border-t border-border">
           <button
             type="button"
             onClick={() => navigate('/')}
             className="text-muted-foreground hover:text-foreground text-sm"
           >
             Jouer sans compte (progression locale)
           </button>
         </div>
       </div>
     </div>
   );
 };
 
 export default Auth;